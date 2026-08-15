"use client"

import { useEffect, useMemo, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { v4 as uuid } from "uuid"
import {
	Cargo,
	CargoOrder,
	capacityLevel,
	cargoTotalWeight,
} from "@/types/Delivery"
import CargoCard from "./cargo-card"
import UnassignedOrdersList from "./unassigned-orders-list"
import { OrderItemRow } from "@/types/Order"
import { useCars } from "@/hooks/cars/use-cars"
import { groupSelectedIntoCargaOrders } from "@/lib/functions/delivery"

interface DeliveryPlannerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	selectedItems: OrderItemRow[]
	onConfirm: (cargos: Cargo[]) => void
}

function newCargo(): Cargo {
	return {
		id: uuid(),
		car_id: null,
		delivery_date: null,
		orders: [],
		status: "draft",
	}
}

export default function DeliveryPlanner({
	open,
	onOpenChange,
	selectedItems,
	onConfirm,
}: DeliveryPlannerProps) {
	const { data: cars } = useCars()
	const [cargos, setCargos] = useState<Cargo[]>([newCargo()])
	const [unassignedOrders, setUnassignedOrders] = useState<CargoOrder[]>([])

	console.log("unassignedOrders", unassignedOrders)
	console.log("cargos", cargos)
	// re-sincroniza sempre que o dialog abre com a seleção atual
	useEffect(() => {
		if (!open) return
		setCargos([newCargo()])
		setUnassignedOrders(groupSelectedIntoCargaOrders(selectedItems))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	function assignToCargo(order: CargoOrder, cargaId: string) {
		setUnassignedOrders((prev) =>
			prev.filter((o) => o.cod_order !== order.cod_order),
		)
		setCargos((prev) =>
			prev.map((c) =>
				c.id === cargaId ? { ...c, orders: [...c.orders, order] } : c,
			),
		)
	}

	function unassignFromCargo(order: CargoOrder, cargo_id: string) {
		setCargos((prev) =>
			prev.map((c) =>
				c.id === cargo_id
					? {
							...c,
							orders: c.orders.filter((o) => o.cod_order !== order.cod_order),
						}
					: c,
			),
		)
		setUnassignedOrders((prev) => [...prev, order])
	}

	function updateCargo(cargo_id: string, patch: Partial<Cargo>) {
		setCargos((prev) =>
			prev.map((c) => (c.id === cargo_id ? { ...c, ...patch } : c)),
		)
	}

	function toggleNf(cargo_id: string, codOrder: string | number) {
		setCargos((prev) =>
			prev.map((c) =>
				c.id === cargo_id
					? {
							...c,
							orders: c.orders.map((o) =>
								o.cod_order === codOrder ? { ...o, has_nf: !o.has_nf } : o,
							),
						}
					: c,
			),
		)
	}

	function addCargo() {
		setCargos((prev) => [...prev, newCargo()])
	}

	function removeCargo(cargo_id: string) {
		const cargo = cargos.find((c) => c.id === cargo_id)
		if (!cargo) return
		setUnassignedOrders((prev) => [...prev, ...cargo.orders])
		setCargos((prev) => prev.filter((c) => c.id !== cargo_id))
	}

	// bloqueia confirmação se alguma cargo estiver sobrepeso, sem veículo/motorista,
	// ou se ainda houver pedido sem cargo
	const blockingIssues = useMemo(() => {
		const issues: string[] = []
		if (unassignedOrders.length > 0) {
			issues.push(
				`${unassignedOrders.length} pedido(s) ainda sem carga atribuída`,
			)
		}
		for (const cargo of cargos) {
			if (cargo.orders.length === 0) continue
			if (!cargo.car_id) issues.push("Carga sem veículo selecionado")
			/* if (!cargo.driver_id) issues.push("Carga sem motorista selecionado") */
			if (!cargo.delivery_date) issues.push("Carga sem data de entrega")
			const car = cars?.find((c) => c.id === cargo.car_id)
			if (
				car &&
				capacityLevel(cargoTotalWeight(cargo), Number(car.capacity)) === "over"
			) {
				issues.push(`Carga excede a capacidade do veículo ${car.plate}`)
			}
		}
		return issues
	}, [cargos, unassignedOrders, cars])

	const activeCargos = cargos.filter(
		(c) => c.orders.length > 0 || cargos.length === 1,
	)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				style={{ width: "70vw", maxWidth: "92vw", maxHeight: "90vh" }}
				className="max-w-5xl max-h-[85vh] overflow-y-auto"
			>
				<DialogHeader>
					<DialogTitle>Programar Entrega</DialogTitle>
				</DialogHeader>

				<DialogDescription className="grid grid-cols-[240px_1fr] gap-6">
					<UnassignedOrdersList
						orders={unassignedOrders}
						cargos={cargos}
						onAssign={assignToCargo}
					/>

					<div className="flex flex-col gap-4">
						{cargos.map((cargo, idx) => (
							<CargoCard
								key={cargo.id}
								index={idx + 1}
								cargo={cargo}
								cars={cars}
								onUpdate={(patch) => updateCargo(cargo.id, patch)}
								onUnassignOrder={(order) => unassignFromCargo(order, cargo.id)}
								onToggleNf={(codOrder) => toggleNf(cargo.id, codOrder)}
								onRemove={
									cargos.length > 1 ? () => removeCargo(cargo.id) : undefined
								}
							/>
						))}

						<Button variant="outline" onClick={addCargo} className="self-start">
							+ Nova Carga
						</Button>
					</div>
				</DialogDescription>

				<DialogFooter className="flex-col items-stretch gap-2 sm:flex-col">
					{blockingIssues.length > 0 && (
						<ul className="text-sm text-red-600 list-disc list-inside">
							{blockingIssues.map((issue) => (
								<li key={issue}>{issue}</li>
							))}
						</ul>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button
							disabled={blockingIssues.length > 0}
							onClick={() =>
								onConfirm(cargos.filter((c) => c.orders.length > 0))
							}
						>
							Confirmar {cargos.filter((c) => c.orders.length > 0).length}{" "}
							Carga(s)
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
