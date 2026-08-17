// helper para agrupar OrderItemRow[] selecionados em CargaOrder[] por pedido
import { Car, CarCapacityRead } from "@/schemas/Car"
import { CapacityLevel, Cargo, CargoOrder } from "@/types/Delivery"
import { OrderItemRow } from "@/types/Order"

export function groupSelectedIntoCargaOrders(
	items: OrderItemRow[],
): CargoOrder[] {
	const byOrder = new Map<string | number, CargoOrder>()

	for (const item of items) {
		const key = item.cod_order
		const weight = item.product_weight ?? 0 * Number(item.quantity)
		const existing = byOrder.get(key)

		if (existing) {
			;((existing.total_weight_kg += item.item_total_weight),
				(existing.total_value += Number(item.item_total_value)))
		} else {
			byOrder.set(key, {
				cod_order: key,
				client_name: item.client_name,
				total_weight_kg: item.item_total_weight,
				total_value: Number(item.item_total_value),
				has_nf: false,
			})
		}
	}

	return Array.from(byOrder.values())
}

export function cargoTotalWeight(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_weight_kg, 0)
}

export function cargoTotalValue(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_value, 0)
}

// warning a partir de 90% da capacidade, over acima de 100%
export function capacityLevel(
	weight: number,
	carCapacity: CarCapacityRead[],
): CapacityLevel {
	console.log("carCapacity", carCapacity)
	/* if (car.capacities["m3"] <= 0) return "ok"
	const ratio = weight / capacity
	if (ratio > 1) return "over"
	if (ratio >= 0.9) return "warning" */
	return "ok"
}
