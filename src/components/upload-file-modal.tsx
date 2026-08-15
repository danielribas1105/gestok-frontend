"use client"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useClients } from "@/hooks/clients/use-clients"
import { useProducts } from "@/hooks/products/use-products"
import { calcularPesoPorCaixa } from "@/lib/functions/order"
import { ValidationResult } from "@/lib/validators/order-import"
import { Order } from "@/schemas/Order"
import { OrderCreateItemPaylod, OrderCreatePayload } from "@/types/Order"
import {
	createHeaderKey,
	generateNameCode,
	normalizeHeader,
	normalizeText,
	validateFileHeaders,
} from "@/utils/data-file-validation"
import { converterDataParaBR } from "@/utils/format-date"
import { parseNumberBR } from "@/utils/format-numbers"
import { Slice, Upload } from "lucide-react"
import Papa from "papaparse"
import { useState } from "react"
import * as XLSX from "xlsx"

// TIPO DE OPERAÇÃO (planilha, pt-BR) -> operation_type (schema)
const OPERATION_TYPE_MAP: Record<string, Order["operation_type"]> = {
	VENDA: "sale",
	DEGUSTACAO: "tasting",
	BONIFICACAO: "bonus",
}

interface UploadFileModalProps {
	open: boolean
	onClose: () => void
	onOrdersReady?: (
		payloads: OrderCreatePayload[],
		rawRows: Record<string, any>[],
		headers: string[],
	) => void
}

function buildErrorMessage(result: ValidationResult): string {
	if (result.missingColumns.length > 0) {
		return `Colunas obrigatórias ausentes: ${result.missingColumns.join(", ")}`
	}
	const first = result.rowErrors.slice(0, 5)
	const extra =
		result.rowErrors.length > 5
			? ` (+${result.rowErrors.length - 5} outras)`
			: ""
	return (
		first.map((e) => `Linha ${e.row}: ${e.errors.join("; ")}`).join(" | ") +
		extra
	)
}

export function UploadFileModal({
	open,
	onClose,
	onOrdersReady,
}: UploadFileModalProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const processRows = (headers: string[], rows: Record<string, any>[]) => {
		console.log("header", headers)
		console.log("rows", rows)
		const errors: string[] = []
		const ordersMap = new Map<
			string,
			Omit<OrderCreatePayload, "items"> & { items: OrderCreateItemPaylod[] }
		>()

		rows.forEach((row, index) => {
			const order_code = String(row["pedido"] ?? "").trim()
			const product = generateNameCode(row["produto"])
			const quantity_product = parseNumberBR(row["quantidade"])
			const unit_product = String(row["un_medida"] ?? "-")
			/* const weight_product = calcularPesoPorCaixa(product) */
			const weight_product = calcularPesoPorCaixa(product, 0.1, false)
			const releasedAtRaw = row["dt_liberacao"]
			const releasedAt =
				typeof releasedAtRaw === "string" && releasedAtRaw.trim() === ""
					? null
					: converterDataParaBR(releasedAtRaw)
			const existing = ordersMap.get(order_code)

			const item: OrderCreateItemPaylod = {
				code: order_code,
				product_id: product,
				quantity: quantity_product,
				unit: unit_product,
				weight: Number(weight_product.toFixed(2)),
				total_price: parseNumberBR(row["valor"]),
				item_number: String(row["item"]),
			}

			if (!existing) {
				ordersMap.set(order_code, {
					code: order_code,
					branch_code: String(row["filial"] ?? "").trim(),
					issued_at: converterDataParaBR(row["emissao_pedido"]) ?? null,
					operation_type:
						OPERATION_TYPE_MAP[normalizeText(row["tipo_de_operacao"])],
					release_reason: row["motivo_de_liberacao"]?.trim?.() || null,
					released_at: releasedAt,
					client_id: String(row["cod_cliente"]),
					store_id: String(row["loja"]).trim() ?? "",
					saller_id: String(row["rota"]).trim() ?? "",
					supervisor_id: String(row["supervisor"]).trim() ?? "",
					manager_id: String(row["gerente"]).trim() ?? "",
					items: [item],
				} as any)
				return
			}
			// mesmo produto repetido no mesmo pedido -> soma quantidade
			const existingItem = existing.items.find((i) => i.product_id === product)
			if (existingItem) {
				existingItem.quantity += quantity_product
			} else {
				existing.items.push(item)
			}
		})

		const payloads = Array.from(ordersMap.values())
		console.log("payloads", payloads)
		console.log("errors", errors)

		if (errors.length > 0) {
			const first = errors.slice(0, 5)
			const extra = errors.length > 5 ? ` (+${errors.length - 5} outras)` : ""
			setError(first.join(" | ") + extra)
			setLoading(false)
			return
		}

		onOrdersReady?.(payloads, rows, headers)
		setLoading(false)
		onClose()
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setError("")
		setLoading(true)

		const extension = file.name.split(".").pop()?.toLowerCase()

		if (extension === "csv") {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				transformHeader: normalizeHeader,
				beforeFirstChunk: (chunk) => {
					const lines = chunk.split(/\r\n|\n/)
					lines.shift() // remove a linha de título
					return lines.join("\n")
				},
				complete: (results) => {
					const rows = results.data as any[]

					if (!results.meta.fields || results.meta.fields.length === 0) {
						setError("Não foi possível identificar o cabeçalho do arquivo.")
						setLoading(false)
						return
					}

					// valida se sobrou dado após remover título + extrair headers
					if (rows.length === 0) {
						setError("O arquivo não contém dados após o título e o cabeçalho.")
						setLoading(false)
						return
					}
					processRows(results.meta.fields || [], rows)
				},
				error: (err) => {
					setError(`Erro ao processar CSV: ${err.message}`)
					setLoading(false)
				},
			})
		} else if (["xlsx", "xls"].includes(extension!)) {
			const reader = new FileReader()
			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target!.result as ArrayBuffer)
					const workbook = XLSX.read(data, { type: "array" })
					const sheet = workbook.Sheets[workbook.SheetNames[0]]
					const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
						raw: false,
						defval: null,
						range: 1, // pula a linha 1 (título) e usa a linha 2 como cabeçalho
					})

					if (rawRows.length === 0) {
						setError("O arquivo não contém dados após o título e o cabeçalho.")
						setLoading(false)
						return
					}

					const originalHeaders = Object.keys(rawRows[0])
					//console.log("originalHeaders", originalHeaders)
					const headerMap = new Map(
						originalHeaders.map((h) => [h, createHeaderKey(h)]),
					)
					//console.log("headerMap", headerMap)
					const missingColumnsHeader = validateFileHeaders(
						Array.from(headerMap.values()),
					)
					//console.log("validationHeaders", missingColumnsHeader)
					const normalizedRows = rawRows.map((row) => {
						const newRow: Record<string, any> = {}
						for (const [original, normalized] of headerMap)
							newRow[normalized] = row[original]
						return newRow
					})
					//console.log("normalizedRows", normalizedRows)
					processRows(Array.from(headerMap.values()), normalizedRows)
				} catch (err: any) {
					setError(`Erro ao processar Excel: ${err.message}`)
					setLoading(false)
				}
			}
			reader.readAsArrayBuffer(file)
		} else {
			setError("Formato inválido. Envie um arquivo .csv, .xlsx ou .xls.")
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Carregar Arquivo</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col items-center justify-center py-6">
					<label className="cursor-pointer flex flex-col items-center gap-3 border-2 border-dashed border-gray-400 rounded-xl p-6 hover:border-blue-500 transition">
						<div className="bg-blue-100 rounded-full p-4">
							<Upload className="text-blue-600 w-8 h-8" />
						</div>
						<span className="text-sm text-gray-700">
							{loading
								? "Processando arquivo..."
								: "Clique para selecionar um arquivo"}
						</span>
						<input
							type="file"
							accept=".csv,.xlsx,.xls"
							onChange={handleFileUpload}
							className="hidden"
							disabled={loading}
						/>
					</label>

					{error && <p className="text-red-600 text-sm mt-4">{error}</p>}
				</div>
			</DialogContent>
		</Dialog>
	)
}
