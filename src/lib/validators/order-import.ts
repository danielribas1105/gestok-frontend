import { OrderCreateItem, OrderCreatePayload } from "@/hooks/orders/use-orders"

export const REQUIRED_COLUMNS = [
	"COD PEDIDO",
	"COD. CLIENTE",
	"TIPO PEDIDO",
	"PRODUTO",
	"QUANTIDADE",
	"VALOR UNITARIO",
] as const

export type RequiredColumn = (typeof REQUIRED_COLUMNS)[number]

export interface ValidationResult {
	valid: boolean
	missingColumns: string[]
	rowErrors: RowError[]
}

export interface RowError {
	row: number // índice da linha (1-based, considerando cabeçalho)
	errors: string[]
}

// mesma normalização que você já usa no transformHeader do CSV
export function normalizeHeader(header: string): string {
	return header
		.trim()
		.replace(/\uFEFF/g, "")
		.replace(/\./g, "")
		.toUpperCase()
}

export function validateHeaders(headers: string[]): string[] {
	const normalized = headers.map(normalizeHeader)
	return REQUIRED_COLUMNS.filter((required) => !normalized.includes(required))
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
	const missingColumns = validateHeaders(headers)
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
	cod_product: string
}

export interface GroupResult {
	payloads: OrderCreatePayload[]
	errors: string[]
}

export function groupRowsIntoOrders(
	rows: Record<string, any>[],
	clients: ClientRef[],
	products: ProductRef[],
): GroupResult {
	const clientMap = new Map(clients.map((c) => [String(c.cod_client), c.id]))
	const productMap = new Map(products.map((p) => [String(p.cod_product), p.id]))

	const errors: string[] = []

	// order_id (código da planilha) -> dados acumulados
	const ordersMap = new Map<
		string,
		{
			cod_order: number
			client_id: string
			client_cod: string // guardado só para mensagens de erro
			order_type: OrderCreatePayload["order_type"]
			observations?: string
			items: OrderCreateItem[]
		}
	>()

	rows.forEach((row, index) => {
		const rowNumber = index + 2 // header + 1-based
		const codOrder = String(row["COD PEDIDO"])
		const codClient = String(row["COD. CLIENTE"])
		const codProduct = String(row["COD PRODUTO"])
		const orderType = String(
			row["TIPO PEDIDO"],
		).toUpperCase() as OrderCreatePayload["order_type"]

		const clientId = clientMap.get(codClient)
		const productId = productMap.get(codProduct)

		if (!clientId) {
			errors.push(
				`Linha ${rowNumber}: cliente com código "${codClient}" não encontrado`,
			)
			return
		}
		if (!productId) {
			errors.push(
				`Linha ${rowNumber}: produto com código "${codProduct}" não encontrado`,
			)
			return
		}

		const quantity = Number(row["QUANTIDADE"])
		const unitValue = Number(String(row["VALOR UNITARIO"]).replace(",", "."))

		const item: OrderCreateItem = {
			product_id: productId,
			quantity,
			unit_value: unitValue,
		}

		const existing = ordersMap.get(codOrder)

		if (!existing) {
			ordersMap.set(codOrder, {
				cod_order: Number(codOrder),
				client_id: clientId,
				client_cod: codClient,
				order_type: orderType,
				observations: row["OBSERVACOES"] || undefined,
				items: [item],
			})
			return
		}

		// --- validação de consistência dentro do mesmo pedido ---
		if (existing.client_id !== clientId) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} já está associado ao cliente "${existing.client_cod}", mas esta linha traz "${codClient}"`,
			)
			return
		}

		if (existing.order_type !== orderType) {
			errors.push(
				`Linha ${rowNumber}: pedido ${codOrder} já está com tipo "${existing.order_type}", mas esta linha traz "${orderType}"`,
			)
			return
		}

		// mesmo produto repetido no mesmo pedido? soma quantidade em vez de duplicar item
		const existingItem = existing.items.find((i) => i.product_id === productId)
		if (existingItem) {
			existingItem.quantity += quantity
		} else {
			existing.items.push(item)
		}
	})

	const payloads: OrderCreatePayload[] = Array.from(ordersMap.values()).map(
		({ client_cod, ...payload }) => payload,
	)

	return { payloads, errors }
}
