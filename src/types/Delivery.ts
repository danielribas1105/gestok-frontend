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
	total_weight_kg: number
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

export function cargoTotalWeight(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_weight_kg, 0)
}

export function cargoTotalValue(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_value, 0)
}

export type CapacityLevel = "ok" | "warning" | "over"

// warning a partir de 90% da capacidade, over acima de 100%
export function capacityLevel(weight: number, capacity: number): CapacityLevel {
	if (capacity <= 0) return "ok"
	const ratio = weight / capacity
	if (ratio > 1) return "over"
	if (ratio >= 0.9) return "warning"
	return "ok"
}
