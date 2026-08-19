export type DeliveryStatus =
	| "draft"
	| "scheduled"
	| "in_route"
	| "delivered"
	| "canceled"

// Pedido já "resumido" pra dentro de uma cargo (não precisamos mais
// dos itens linha a linha aqui, só o agregado por pedido)
export interface CargoOrder {
	cod_order: string | number
	client_name: string
	total_kg: number
	total_volume: number
	total_quantity: number
	total_value: number
	has_nf: boolean
}

export interface Cargo {
	id: string // uuid temporário até salvar no backend
	car_id: string | null
	delivery_date: string | null // ISO date (yyyy-mm-dd)
	orders: CargoOrder[]
	status: DeliveryStatus
}

export type CapacityLevel = "ok" | "warning" | "over"
