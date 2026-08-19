"use client"

import { Cargo, CargoOrder } from "@/types/Delivery"

interface UnassignedOrdersListProps {
	orders: CargoOrder[]
	cargos: Cargo[]
	onAssign: (order: CargoOrder, cargaId: string) => void
}

export default function UnassignedOrdersList({
	orders,
	cargos,
	onAssign,
}: UnassignedOrdersListProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-medium text-gray-600">
				Pedidos sem carga ({orders.length})
			</span>
			<div className="flex flex-col divide-y border rounded-md max-h-[60vh] overflow-y-auto">
				{orders.length === 0 && (
					<div className="text-sm text-gray-400 text-center py-4">
						Tudo atribuído
					</div>
				)}
				{orders.map((order) => (
					<div
						key={order.cod_order}
						className="flex flex-col gap-1 px-3 py-2 text-sm"
					>
						<span className="font-medium">#{order.cod_order}</span>
						<span className="text-gray-500 truncate">{order.client_name}</span>
						<span className="text-gray-400 text-xs">
							{`${order.total_quantity} caixas / ${order.total_volume.toLocaleString("pt-BR")} m3 / ${order.total_kg.toLocaleString("pt-BR")} kg`}
						</span>
						<select
							className="border rounded-md px-1.5 py-1 text-xs mt-1"
							defaultValue=""
							onChange={(e) => {
								if (e.target.value) onAssign(order, e.target.value)
							}}
						>
							<option value="">Atribuir a...</option>
							{cargos.map((c, idx) => (
								<option key={c.id} value={c.id}>
									Carga {idx + 1}
								</option>
							))}
						</select>
					</div>
				))}
			</div>
		</div>
	)
}
