// helper para agrupar OrderItemRow[] selecionados em CargaOrder[] por pedido
import { CargoOrder } from "@/types/Delivery"
import { OrderItemRow } from "@/types/Order"

export function groupSelectedIntoCargaOrders(
	items: OrderItemRow[],
): CargoOrder[] {
	const byOrder = new Map<string | number, CargoOrder>()

	for (const item of items) {
		const key = item.cod_order
		const weight = (item.product_weight ?? 0) * Number(item.quantity)
		const existing = byOrder.get(key)

		if (existing) {
			existing.total_weight_kg += weight
			existing.total_value += Number(item.item_total_value)
		} else {
			byOrder.set(key, {
				cod_order: key,
				client_name: item.client_name,
				total_weight_kg: weight,
				total_value: Number(item.item_total_value),
				has_nf: false,
			})
		}
	}

	return Array.from(byOrder.values())
}
