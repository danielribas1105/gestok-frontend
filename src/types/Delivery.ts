export type DeliveryStatus =
	| "pending"
	| "in_transit"
	| "return"
	| "canceled"
	| "concluded"

// Pedido já "resumido" pra dentro de uma cargo (não precisamos mais
// dos itens linha a linha aqui, só o agregado por pedido)
export interface CargoOrder {
	order_id: string
	cod_order: string
	client_name: string
	total_kg: number
	total_volume: number
	total_quantity: number
	total_value: number
	has_nf: boolean
}

export interface Cargo {
	id: string // uuid temporário até salvar no backend
	car_id: string
	user_id: string
	delivery_date: Date | null | undefined // ISO date (yyyy-mm-dd)
	orders: CargoOrder[]
	status: DeliveryStatus
}

export type CapacityLevel = "ok" | "warning" | "over"

export interface DeliveryCreatePayload {
	order_id: string
	car_id: string
	user_id: string
	invoice: string
	weight: string
	status: DeliveryStatus
	observations: string
	created_at: Date | null | undefined
	departed_at: Date | null | undefined
	delivery_at: Date | null | undefined
	delivery_confirmed: boolean
}

export interface DeliveryReadPayload {
	id: string
	order_id: string
	car_id: string
	user_id: string
	invoice: string
	weight: number
	status: DeliveryStatus
	observations: string
	created_at: Date | null | undefined
	departed_at: Date | null | undefined
	delivery_at: Date | null | undefined
	delivery_confirmed: boolean

	order_code: string
	car: string
	driver: string
	user: string
}
