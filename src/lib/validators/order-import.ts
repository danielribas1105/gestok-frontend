import { Order } from "@/schemas/Order"
import { OrderItem } from "@/schemas/OrderItem"
import { OrderCreateItemPaylod, OrderCreatePayload } from "@/types/Order"
import {
	generateNameCode,
	normalizeText,
	validateFileHeaders,
} from "@/utils/data-file-validation"
import { converterDataParaBR } from "@/utils/format-date"
import { parseNumberBR } from "@/utils/format-numbers"

/* export type RequiredColumn = (typeof REQUIRED_COLUMNS)[number] */

export interface ValidationResult {
	valid: boolean
	missingColumns: string[]
	rowErrors: RowError[]
}

export interface RowError {
	row: number // índice da linha (1-based, considerando cabeçalho)
	errors: string[]
}

export function validateRows(rows: Record<string, any>[]): RowError[] {
	const errors: RowError[] = []

	rows.forEach((row, index) => {
		const rowErrors: string[] = []

		if (!row["COD PEDIDO"]) rowErrors.push("COD PEDIDO ausente")
		if (!row["COD. CLIENTE"]) rowErrors.push("COD. CLIENTE ausente")

		const tipo = String(row["TIPO PEDIDO"] || "").toUpperCase()
		if (!["BONIFICACAO", "DEGUSTACAO", "VENDA"].includes(tipo)) {
			rowErrors.push(`TIPO PEDIDO inválido: "${row["TIPO PEDIDO"]}"`)
		}

		if (!row["COD PRODUTO"]) rowErrors.push("COD PRODUTO ausente")

		const quantidade = Number(row["QUANTIDADE"])
		if (isNaN(quantidade) || quantidade <= 0) {
			rowErrors.push(`QUANTIDADE inválida: "${row["QUANTIDADE"]}"`)
		}

		const valorUnitario = Number(
			String(row["VALOR UNITARIO"]).replace(",", "."),
		)
		if (isNaN(valorUnitario) || valorUnitario < 0) {
			rowErrors.push(`VALOR UNITARIO inválido: "${row["VALOR UNITARIO"]}"`)
		}

		if (rowErrors.length > 0) {
			errors.push({ row: index + 2, errors: rowErrors }) // +2 = header + 1-based
		}
	})

	return errors
}

export function validateFile(
	headers: string[],
	rows: Record<string, any>[],
): ValidationResult {
	const missingColumns = validateFileHeaders(headers)
	// se faltar coluna, nem vale a pena validar linha por linha
	const rowErrors = missingColumns.length === 0 ? validateRows(rows) : []

	return {
		valid: missingColumns.length === 0 && rowErrors.length === 0,
		missingColumns,
		rowErrors,
	}
}

export interface ClientRef {
	id: string
	cod_client: string
}

export interface ProductRef {
	id: string
	// planilha não traz código de produto, só a descrição —
	// então o "cod_product" aqui é a descrição normalizada
	cod_product: string
}

export interface StoreRef {
	id: string
	cod_store: string // LOJA
}

export interface PersonRef {
	id: string
	cod: string // código de SUPERVISOR / GERENTE
}

export interface GroupResult {
	payloads: OrderCreatePayload[]
	errors: string[]
}

// TIPO DE OPERAÇÃO (planilha, pt-BR) -> operation_type (schema)
const OPERATION_TYPE_MAP: Record<string, Order["operation_type"]> = {
	VENDA: "sale",
	DEGUSTACAO: "tasting",
	BONIFICACAO: "bonus",
}

function buildRefMap<T extends { id: string }>(
	list: T[],
	getCode: (item: T) => string,
): Map<string, string> {
	return new Map(list.map((item) => [normalizeText(getCode(item)), item.id]))
}

export function groupRowsIntoOrders(
	rows: Record<string, any>[],
	clients: ClientRef[],
	products: ProductRef[],
	stores: StoreRef[] = [],
	supervisors: PersonRef[] = [],
	managers: PersonRef[] = [],
): GroupResult {
	const clientMap = buildRefMap(clients, (c) => c.cod_client)
	const productMap = buildRefMap(products, (p) => p.cod_product)
	const storeMap = buildRefMap(stores, (s) => s.cod_store)
	const supervisorMap = buildRefMap(supervisors, (s) => s.cod)
	const managerMap = buildRefMap(managers, (m) => m.cod)

	const errors: string[] = []

	// código do pedido (planilha) -> payload em construção
	const ordersMap = new Map<
		string,
		Omit<OrderCreatePayload, "items"> & { items: OrderCreateItemPaylod[] }
	>()

	rows.forEach((row, index) => {
		const rowNumber = index + 3 // linha de título + cabeçalho + 1-based

		const codOrder = String(row["pedido"] ?? "").trim()
		const codBranch = String(row["filial"] ?? "").trim()
		const codClient = row["cod_cliente"]
		const productDesc = generateNameCode(row["produto"])
		const operationRaw = normalizeText(row["tipo_de_operacao"])
		const quantity = parseNumberBR(row["quantidade"])
		const totalPrice = parseNumberBR(row["valor"])
		const itemValue = row["item"]
		const rowValue = parseNumberBR(row["valor"])

		/* if (!codOrder) {
			errors.push(`Linha ${rowNumber}: PEDIDO ausente`)
			return
		} */

		const operationType = OPERATION_TYPE_MAP[operationRaw]
		/* if (!operationType) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} - TIPO DE OPERAÇÃO inválido: "${row["tipo_de_operacao"]}"`,
			)
			return
		} */

		/* const clientId = clientMap.get(normalizeText(codClient))
		if (!clientId) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} - cliente com código "${codClient}" não encontrado`,
			)
			return
		}

		const productId = productMap.get(normalizeText(productDesc))
		if (!productId) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} - produto "${productDesc}" não encontrado`,
			)
			return
		} */

		/* if (isNaN(quantity) || quantity <= 0) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} - QUANTIDADE inválida: "${row["quantidade"]}"`,
			)
			return
		} */

		/* if (isNaN(rowValue) || rowValue < 0) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} - VALOR inválido: "${row["valor"]}"`,
			)
			return
		} */

		const storeId = String(row["loja"]).trim()
		const sallerId = String(row["rota"]).trim()
		const supervisorId = String(row["supervisor"]).trim()
		const managerId = String(row["gerente"]).trim()

		const item: OrderItem = {
			order_id: codOrder,
			product_id: productDesc,
			quantity,
			total_price: totalPrice,
			item_number: itemValue,
			row_hash: "",
		}

		const existing = ordersMap.get(codOrder)

		if (!existing) {
			ordersMap.set(codOrder, {
				branch_code: codBranch,
				code: codOrder,
				issued_at: converterDataParaBR(row["emissao_pedido"]) ?? null,
				operation_type: operationType,
				release_reason: row["motivo_de_liberacao"]?.trim?.() || null,
				released_at: row["dt_liberacao"] ?? null,
				client_id: codClient, //clientId
				store_id: storeId ?? "",
				saller_id: sallerId ?? "",
				supervisor_id: supervisorId ?? "",
				manager_id: managerId ?? "",
				observations: null,
				items: [item],
			} as any)
			return
		}

		// mesmo produto repetido no mesmo pedido -> soma quantidade
		/* const existingItem = existing.items.find((i) => i.product_id === productId)
		if (existingItem) {
			existingItem.quantity += quantity
		} else {
			existing.items.push(item)
		} */
	})

	const payloads = Array.from(ordersMap.values())
	return { payloads: payloads as OrderCreatePayload[], errors }
}
