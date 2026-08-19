// helper para agrupar OrderItemRow[] selecionados em CargaOrder[] por pedido
import { CarCapacityRead } from "@/schemas/Car"
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
			;((existing.total_kg += item.item_total_weight),
				(existing.total_volume += item.item_total_volume),
				(existing.total_value += Number(item.item_total_value)))
		} else {
			byOrder.set(key, {
				cod_order: key,
				client_name: item.client_name,
				total_kg: item.item_total_weight,
				total_volume: item.item_total_volume,
				total_quantity: item.total_order_quantity,
				total_value: Number(item.item_total_value),
				has_nf: false,
			})
		}
	}

	return Array.from(byOrder.values())
}

export function cargoTotalWeight(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_kg, 0)
}
export function cargoTotalVolume(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_volume, 0)
}
export function cargoTotalBoxes(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_quantity, 0)
}

export function cargoTotalValue(cargo: Cargo): number {
	return cargo.orders.reduce((sum, o) => sum + o.total_value, 0)
}

// warning a partir de 90% da capacidade, over acima de 100%
export function capacityLevel(
	weight: number,
	volume: number,
	boxes: number,
	carCapacity: CarCapacityRead[],
): CapacityLevel {
	console.log("weight", weight)
	console.log("volume", volume)
	console.log("boxes", boxes)
	console.log("carCapacity", carCapacity)
	const volumeCapacity = carCapacity.find((capacity) => capacity.unit === "m3")

	const boxesCapacity = carCapacity.find(
		(capacity) => capacity.unit === "boxes",
	)

	const ratios: number[] = []

	if (volumeCapacity && volumeCapacity.value > 0) {
		ratios.push(volume / volumeCapacity.value)
	}

	if (boxesCapacity && boxesCapacity.value > 0) {
		ratios.push(boxes / boxesCapacity.value)
	}

	// Sem capacidade configurada, considera normal
	if (ratios.length === 0) {
		return "ok"
	}

	// Considera a dimensão que estiver mais próxima da capacidade
	const maxRatio = Math.max(...ratios)

	if (maxRatio > 1) {
		return "over"
	}

	if (maxRatio >= 0.9) {
		return "warning"
	}

	return "ok"
}
