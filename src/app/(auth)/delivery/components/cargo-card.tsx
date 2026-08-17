"use client"

import { Cargo, CargoOrder } from "@/types/Delivery"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { Car } from "@/schemas/Car"
import { cargoTotalValue, cargoTotalWeight } from "@/lib/functions/delivery"
import { CAPACITY_LABELS } from "@/constants/Cars"

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
	//const level = car ? capacityLevel(weight, car.capacity ?? 0) : "ok"

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
							console.log("selectedCar", selectedCar)
							onUpdate({
								car_id: v || null,
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
									{v.plate} — {v.model} {/* ({v.capacity}kg) */}
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
					<Label htmlFor="delivery-date">Agendar entrega*</Label>
					<Input
						id="delivery-date"
						type="date"
						placeholder="dd/mm/aaaa"
						value={cargo.delivery_date ?? ""}
						onChange={(e) =>
							onUpdate({ delivery_date: e.target.value || null })
						}
					/>
				</div>
			</div>
			<div className="flex gap-2 text-muted-foreground">
				Capacidade carga:
				{car?.capacities.map((c) => (
					<div key={c.id} className="flex gap-2">
						<span className="flex gap-0.5">
							<p>{c.value}</p>
							<p>{CAPACITY_LABELS[c.unit]}</p>
						</span>
						<span>/</span>
					</div>
				))}
			</div>

			{/* barra de capacidade de peso */}
			{/* {car && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-between text-xs text-gray-500">
						<span>
							{weight.toLocaleString("pt-BR")}kg /{" "}
							{car.capacity ? car.capacity.toLocaleString("pt-BR") : 0}kg
						</span>
						<span
							className={cn(
								level === "over" && "text-red-600 font-medium",
								level === "warning" && "text-amber-600 font-medium",
							)}
						>
							{level === "over"
								? "Excede capacidade"
								: level === "warning"
									? "Próximo do limite"
									: "OK"}
						</span>
					</div>
					<div className="h-2 rounded-full bg-gray-100 overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								level === "over"
									? "bg-red-500"
									: level === "warning"
										? "bg-amber-500"
										: "bg-green-500",
							)}
							style={{
								width: `${Math.min((weight / (car.capacity ?? 0)) * 100, 100)}%`,
							}}
						/>
					</div>
				</div>
			)} */}

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
						<span className="text-gray-500 w-16 text-right">
							{order.total_weight_kg.toLocaleString("pt-BR")}kg
						</span>
						<label className="flex items-center gap-1 text-xs text-gray-500">
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
