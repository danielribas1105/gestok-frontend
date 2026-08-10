import { Order } from "@/schemas/Order"
import { Product } from "@/schemas/Product"

export interface OrderItem {
	id: string
	order_id: string
	product_id: string
	quantity: number
	unit_value: number
	total_value: number
	product?: Product
}

export interface OrdersResponse {
	orders: Order[]
	total: number
	page: number
	page_size: number
	total_pages: number
	order_items: OrderItem[]
}

export interface OrderCreateItemPaylod {
	code: string
	product_id: string
	quantity: number
	total_price: number
	item_number: string
}

export interface OrderCreatePayload {
	branch_code: string
	code: string
	issued_at: string | Date
	operation_type: "SALE" | "TASTING" | "BONUS"
	release_reason: string
	released_at: string | Date
	client_id: string
	store_id: string
	saller_id: string
	supervisor_id: string
	manager_id: string
	status:
		| "PENDING"
		| "PROCESSED"
		| "BLOCKED"
		| "IN_TRANSIT"
		| "CANCELED"
		| "CONCLUDED"
	items: OrderCreateItemPaylod[]
}

export interface OrderProcessResponse {
	success: boolean
	message: string
	order: Order
	movements_created: number
}

// Flattened Order Item Row - cada linha representa um item de pedido
export interface OrderItemRow {
	order_id: string
	cod_order: string // era `number` — no schema real, `code` é string
	order_type: "sale" | "tasting" | "bonus" // valores reais de `operation_type`
	order_type_label: string
	order_date?: string // ISO string derivada de `issued_at` (pode ser null no schema)
	order_date_formatted: string
	processed_date?: string // derivado de `processed_at`, não `processed_date`
	processed_date_formatted?: string
	status:
		| "pending"
		| "processed"
		| "blocked"
		| "in_transit"
		| "canceled"
		| "concluded" // 6 estados reais, não 3
	status_label: string
	observations?: string | null

	// TODO: o schema `Order` não tem cliente/vendedor aninhados, só os IDs.
	// client_name/seller_name usam o próprio ID como fallback até definirmos
	// a fonte de enriquecimento (hook de clients/sellers ou join no backend).
	client_id: string
	client_name: string
	client_code?: string
	client_cpf_cnpj?: string
	client_phone?: string
	client_email?: string

	saller_id: string
	seller_name: string
	supervisor_id: string
	manager_id: string

	item_id: string
	product_id: string
	product_code: string
	product_name: string
	product_unit: string
	quantity: number
	unit_value: number
	item_total_value: number

	total_order_items: number
	total_order_value: number

	raw_order: Order
	raw_item: OrderItem
}

export interface FlattenedOrdersResult {
	rows: OrderItemRow[]
	total: number
	page: number
	page_size: number
	total_pages: number
	total_rows: number
}
