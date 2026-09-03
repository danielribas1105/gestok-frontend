"use client"

import { Cargo, CargoOrder } from "@/types/Delivery"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CapacityUnit, Car } from "@/schemas/Car"
import {
	capacityLevel,
	cargoTotalBoxes,
	cargoTotalValue,
	cargoTotalVolume,
	cargoTotalWeight,
} from "@/lib/functions/delivery"
import CapacityBar from "./capacity-bar"

interface CargoCardProps {
	index: number
	cargo: Cargo
	cars?: Car[]
	onUpdate: (patch: Partial<Cargo>) => void
	onUnassignOrder: (order: CargoOrder) => void
	onToggleNf: (codOrder: string | number) => void
	onRemove?: () => void
}

export default function CargoCard({
	index,
	cargo,
	cars,
	onUpdate,
	onUnassignOrder,
	onToggleNf,
	onRemove,
}: CargoCardProps) {
	const car = cars?.find((c) => c.id === cargo.car_id)
	const weight = cargoTotalWeight(cargo)
	const volume = cargoTotalVolume(cargo)
	const boxes = cargoTotalBoxes(cargo)
	const level = car
		? capacityLevel(weight, volume, boxes, car.capacities)
		: "ok"

	const getCapacity = (unit: CapacityUnit) =>
		car?.capacities.find((capacity) => capacity.unit === unit)?.value

	const volumeCapacity = getCapacity("m3")
	const boxesCapacity = getCapacity("boxes")
	const weightCapacity = getCapacity("kg")
	const palletsCapacity = getCapacity("pallets")

	return (
		<div className="rounded-lg border p-4 flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="font-medium">Carga {index}</span>
				{onRemove && (
					<Button variant={"ghost"} onClick={onRemove}>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="space-y-1">
					<Label htmlFor="delivery-car">Veículo*</Label>
					<Select
						value={cargo.car_id ?? ""}
						onValueChange={(v) => {
							const selectedCar = cars?.find((c) => c.id === v)
							onUpdate({
								car_id: v || undefined,
							})
						}}
						required
					>
						<SelectTrigger id="delivery-car" className="w-full">
							<SelectValue placeholder="Veículo..." />
						</SelectTrigger>
						<SelectContent>
							{cars?.map((v) => (
								<SelectItem key={v.id} value={v.id}>
									{v.plate} — {v.model}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label htmlFor="delivery-driver">Motorista</Label>
					<Input
						id="delivery-driver"
						placeholder="Motorista..."
						value={car?.driver?.name}
						disabled={true}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="cargo-delivery-date">Agendar entrega*</Label>
					<Input
						id="cargo-delivery-date"
						type="date"
						placeholder="dd/mm/aaaa"
						value={cargo.schedule_date ?? ""}
						onChange={(e) =>
							onUpdate({ schedule_date: e.target.value || null })
						}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<CapacityBar
					label="Volume"
					unit="m3"
					value={volume}
					capacity={volumeCapacity}
				/>

				<CapacityBar
					label="Caixas"
					unit="boxes"
					value={boxes}
					capacity={boxesCapacity}
				/>

				<CapacityBar
					label="Peso"
					unit="kg"
					value={weight}
					capacity={weightCapacity}
				/>

				<CapacityBar
					label="Pallets"
					unit="pallets"
					value={0}
					capacity={palletsCapacity}
				/>
			</div>

			{/* pedidos atribuídos a essa carga */}
			<div className="flex flex-col divide-y border rounded-md">
				{cargo.orders.length === 0 && (
					<div className="text-sm text-gray-400 text-center py-4">
						Arraste ou atribua pedidos a essa carga
					</div>
				)}
				{cargo.orders.map((order) => (
					<div
						key={order.cod_order}
						className="flex items-center gap-2 px-3 py-2 text-sm"
					>
						<span className="flex-1">
							#{order.cod_order} — {order.client_name}
						</span>
						<span className="text-gray-500 text-right">
							{`${order.total_volume.toLocaleString("pt-BR")} m³ / ${order.total_quantity.toLocaleString("pt-BR")} caixas / ${order.total_kg.toLocaleString("pt-BR")} Kg`}
						</span>
						<label className="flex items-center gap-1 ml-2 text-xs text-gray-500">
							<Checkbox
								checked={order.has_nf}
								onCheckedChange={() => onToggleNf(order.cod_order)}
							/>
							NF
						</label>
						<Button variant={"ghost"} onClick={() => onUnassignOrder(order)}>
							<X className="h-3.5 w-3.5" />
						</Button>
					</div>
				))}
			</div>

			{cargo.orders.length > 0 && (
				<div className="text-xs text-gray-500 text-right">
					Total:{" "}
					{cargoTotalValue(cargo).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</div>
			)}
		</div>
	)
}
