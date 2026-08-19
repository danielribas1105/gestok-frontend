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

export interface OrderCreateItemPaylod {
	code: string
	product_id: string
	quantity: number
	unit: string
	weight: number
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

export interface OrdersFilters {
	search?: string
	dateFrom?: string
	dateTo?: string
	status?: string
	clientId?: string
}

/**
 * Formato cru vindo do backend (GET /orders -> list[OrderResponse]),
 * confirmado contra app/modules/orders/schema.py.
 *
 * ATENÇÃO: OrderItemReadNested não expõe `product_id` — é um gap no
 * schema.py (só existe em OrderItemCreate/OrderItemCreatePayload).
 * Até isso ser corrigido no backend, não tem como ligar o item ao
 * produto, então product_name/product_code ficam com um aviso fixo.
 */
export interface BackendOrderItem {
	id: string
	quantity: number
	total_price: number
	item_number?: string | null
	product_id: string
	product_name_code?: string | null
	product_name?: string | null
	product_code?: string | null
	product_unit?: string | null
	product_weight?: number | 0
	product_volume?: number | 0
	product_boxes_pallet?: number | 0
}
export interface BackendOrder {
	id: string
	branch_code: string
	code: string
	operation_type: string
	status: string
	client_id: string
	client_name: string | null
	store_id: string
	store_name: string | null
	saller_id: string
	saller_name: string | null
	supervisor_id: string
	supervisor_name: string | null
	manager_id: string
	manager_name: string | null
	issued_at?: string | null
	release_reason?: string | null
	released_at?: string | null
	created_at?: string | null
	updated_at?: string | null
	processed_at?: string | null
	observations?: string | null
	items: BackendOrderItem[]
}
// Flattened Order Item Row - cada linha representa um item de pedido
export interface OrderItemRow {
	order_id: string
	cod_order: string // era `number` — no schema real, `code` é string
	operation_type: "sale" | "tasting" | "bonus"
	order_date?: string // ISO string derivada de `issued_at` (pode ser null no schema)
	processed_date?: string // derivado de `processed_at`, não `processed_date`
	status:
		| "pending"
		| "processed"
		| "blocked"
		| "in_transit"
		| "canceled"
		| "concluded"
	observations?: string | null

	client_id: string
	client_name: string
	client_code?: string
	client_cpf_cnpj?: string
	client_phone?: string
	client_email?: string

	saller_id: string
	seller_name: string
	supervisor_id: string
	supervisor_name: string
	manager_id: string
	manager_name: string

	item_id: string
	product_id: string
	product_name_code: string
	product_name: string
	product_code: string
	product_unit: string
	product_weight: number
	product_volume: number
	product_boxes_pallet: number
	quantity: number
	unit_value: number
	item_total_value: number
	item_total_weight: number
	item_total_volume: number

	total_order_items: number
	total_order_value: number
	total_order_quantity: number

	store_id: string
	store_name: string
	branch_code: string
	release_reason?: string | null
	released_at?: string | null
	created_at?: string | null
}

export interface FlattenedOrdersResult {
	rows: OrderItemRow[]
	total: number
	page: number
	page_size: number
	total_pages: number
	total_rows: number
}
