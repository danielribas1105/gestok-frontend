"use client"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { useState } from "react"
import { Upload } from "lucide-react"
import {
	groupRowsIntoOrders,
	normalizeHeader,
	validateFile,
	ValidationResult,
} from "@/lib/validators/order-import"
import { OrderCreatePayload } from "@/hooks/orders/use-orders"
import { useProducts } from "@/hooks/products/use-products"
import { useClients } from "@/hooks/clients/use-clients"

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
	const { data: products } = useProducts()
	const { data: clients } = useClients()

	function processRows(headers: string[], rows: Record<string, any>[]) {
		const validation = validateFile(headers, rows)

		if (!validation.valid) {
			if (validation.missingColumns.length > 0) {
				setError(
					`Colunas obrigatórias ausentes: ${validation.missingColumns.join(", ")}`,
				)
			} else {
				const first = validation.rowErrors.slice(0, 5)
				const extra =
					validation.rowErrors.length > 5
						? ` (+${validation.rowErrors.length - 5} outras)`
						: ""
				setError(
					first
						.map((e) => `Linha ${e.row}: ${e.errors.join("; ")}`)
						.join(" | ") + extra,
				)
			}
			setLoading(false)
			return
		}

		const clientRefs = (clients || []).map((c) => ({
			id: c.id!,
			cod_client: c.code,
		}))
		const productRefs = (products || []).map((p) => ({
			id: p.id!,
			cod_product: p.code,
		}))

		const { payloads, errors } = groupRowsIntoOrders(
			rows,
			clientRefs,
			productRefs,
		)

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
				complete: (results) => {
					processRows(results.meta.fields || [], results.data as any[])
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
					})

					if (rawRows.length === 0) {
						setError("O arquivo está vazio.")
						setLoading(false)
						return
					}

					const originalHeaders = Object.keys(rawRows[0])
					const headerMap = new Map(
						originalHeaders.map((h) => [h, normalizeHeader(h)]),
					)
					const normalizedRows = rawRows.map((row) => {
						const newRow: Record<string, any> = {}
						for (const [original, normalized] of headerMap)
							newRow[normalized] = row[original]
						return newRow
					})

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
