"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useCarMutations } from "@/hooks/cars/use-car-mutations"
import { useDrivers } from "@/hooks/drivers/use-drivers"
import { Car } from "@/schemas/Car"
import type { CapacityUnit } from "@/schemas/Car"
import { Camera } from "lucide-react"
import { useState } from "react"

interface CarFormProps {
	car?: Car
	onSuccess?: () => void
	onCancel?: () => void
}

// Unidades de capacidade disponíveis — espelha CapacityUnitEnum do schema
const CAPACITY_UNITS: { value: CapacityUnit; label: string }[] = [
	{ value: "m3", label: "Volume (m³)" },
	{ value: "boxes", label: "Caixas" },
	{ value: "weight_kg", label: "Peso (kg)" },
	{ value: "pallets", label: "Pallets" },
]

type CapacityFieldState = {
	enabled: boolean
	value: string
	id?: string // presente quando a capacidade já existe (edição)
}

type CapacitiesState = Record<CapacityUnit, CapacityFieldState>

function buildInitialCapacities(car?: Car): CapacitiesState {
	const base = Object.fromEntries(
		CAPACITY_UNITS.map(({ value }) => [
			value,
			{ enabled: false, value: "" } satisfies CapacityFieldState,
		]),
	) as CapacitiesState

	car?.capacities?.forEach((cap) => {
		base[cap.unit] = {
			enabled: true,
			value: cap.value.toString(),
			id: cap.id,
		}
	})

	return base
}

export default function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
	const isEdit = !!car
	const { createCar, updateCar, deleteCar } = useCarMutations()
	const { data: drivers, isLoading: loadingDrivers } = useDrivers()
	const [openAlert, setOpenAlert] = useState(false)

	const initialForm = {
		model: car?.model ?? "",
		driver_id: car?.driver_id ?? "",
		plate: car?.plate ?? "",
		manufacture: car?.manufacture?.toString() ?? "",
		km: car?.km?.toString() ?? "",
		fuel: car?.fuel ?? "diesel",
		active: car?.active ?? true,
		capacities: buildInitialCapacities(car),
	}

	const [form, setForm] = useState(initialForm)

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	// Habilita/desabilita uma unidade de capacidade
	function handleCapacityToggle(unit: CapacityUnit, checked: boolean) {
		setForm((f) => ({
			...f,
			capacities: {
				...f.capacities,
				[unit]: {
					...f.capacities[unit],
					enabled: checked,
					// limpa o valor ao desmarcar, mantém o id se já existia
					value: checked ? f.capacities[unit].value : "",
				},
			},
		}))
	}

	// Atualiza o valor de uma unidade de capacidade
	function handleCapacityValueChange(unit: CapacityUnit, value: string) {
		setForm((f) => ({
			...f,
			capacities: {
				...f.capacities,
				[unit]: { ...f.capacities[unit], value },
			},
		}))
	}

	//  CANCEL
	function handleCancel() {
		setForm(initialForm) // descarta qualquer alteração feita
		onCancel?.() // avisa o pai pra fechar o form/modal
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!form.driver_id) return // proteção extra, além do required do Select

		const capacities = Object.entries(form.capacities)
			.filter(([, c]) => c.enabled && c.value !== "")
			.map(([unit, c]) => ({
				unit: unit as CapacityUnit,
				value: parseFloat(c.value),
				...(c.id ? { id: c.id } : {}),
			}))

		const payload = {
			...form,
			manufacture: form.manufacture ? parseInt(form.manufacture) : null,
			km: form.km ? parseInt(form.km) : null,
			capacities,
		}

		try {
			if (isEdit) {
				await updateCar.mutateAsync({ id: car!.id, data: payload })
			} else {
				await createCar.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!car) return
		try {
			await deleteCar.mutateAsync(car.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createCar.isPending || updateCar.isPending || deleteCar.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Avatar placeholder — upload desabilitado */}
			<div className="flex items-center gap-4">
				<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted text-muted-foreground">
					<Camera className="h-6 w-6" />
				</div>
				<div className="flex flex-col gap-1">
					<Button type="button" variant="outline" size="sm" disabled>
						Enviar foto
					</Button>
					<p className="text-xs text-muted-foreground">
						Upload de imagem em breve.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="model">Modelo *</Label>
					<Input
						id="model"
						placeholder="Modelo"
						value={form.model}
						onChange={(e) => handleChange("model", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="driver">Motorista *</Label>
					<Select
						value={form.driver_id}
						onValueChange={(v) => handleChange("driver_id", v)}
						disabled={loading || loadingDrivers}
						required
					>
						<SelectTrigger id="driver" className="w-full">
							<SelectValue
								placeholder={
									loadingDrivers
										? "Carregando motoristas..."
										: "Selecione um motorista"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{drivers?.map((driver) => (
								<SelectItem key={driver.id} value={driver.id}>
									{driver.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<RadioGroup
						value={form.active ? "true" : "false"}
						onValueChange={(v) => handleChange("active", v === "true")}
						disabled={loading}
						className="flex items-center gap-4 h-9"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="true" id="status-active" />
							<Label htmlFor="status-active" className="font-normal">
								Ativo
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="false" id="status-inactive" />
							<Label htmlFor="status-inactive" className="font-normal">
								Inativo
							</Label>
						</div>
					</RadioGroup>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="space-y-1">
					<Label htmlFor="plate">Placa*</Label>
					<Input
						id="plate"
						placeholder="Placa (ex: ABC1D23)"
						value={form.plate}
						onChange={(e) =>
							handleChange("plate", e.target.value.toUpperCase())
						}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="manufacture">Fabricação</Label>
					<Input
						id="manufacture"
						placeholder="Ano de fabricação"
						value={form.manufacture}
						onChange={(e) => handleChange("manufacture", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="km">Quilometragem</Label>
					<Input
						id="km"
						type="number"
						placeholder="Quilometragem (km)"
						value={form.km}
						onChange={(e) => handleChange("km", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="fuel">Combustível</Label>
					<Select
						value={form.fuel}
						onValueChange={(v) => handleChange("fuel", v)}
						disabled={loading}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Combustível" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="gasoline">Gasolina</SelectItem>
							<SelectItem value="ethanol">Etanol</SelectItem>
							<SelectItem value="diesel">Diesel</SelectItem>
							<SelectItem value="flex">Flex</SelectItem>
							<SelectItem value="electric">Elétrico</SelectItem>
							<SelectItem value="hybrid">Híbrido</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Capacidades de carga — um veículo pode ter várias unidades ao mesmo tempo */}
			<div className="space-y-2 border-2 rounded-2xl p-3">
				<Label>Capacidade de carga</Label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					{CAPACITY_UNITS.map(({ value: unit, label }) => {
						const field = form.capacities[unit]
						return (
							<div key={unit} className="space-y-1">
								<div className="flex items-center gap-2">
									<Checkbox
										id={`capacity-${unit}`}
										checked={field.enabled}
										onCheckedChange={(checked) =>
											handleCapacityToggle(unit, checked === true)
										}
										disabled={loading}
									/>
									<Label htmlFor={`capacity-${unit}`} className="font-normal">
										{label}
									</Label>
								</div>
								<Input
									id={`capacity-value-${unit}`}
									type="number"
									min={0}
									step="any"
									placeholder={label}
									value={field.value}
									onChange={(e) =>
										handleCapacityValueChange(unit, e.target.value)
									}
									disabled={loading || !field.enabled}
									required={field.enabled}
								/>
							</div>
						)
					})}
				</div>
			</div>

			<div className="flex items-center justify-between">
				{isEdit && (
					<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteCar.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o veículo <strong>{car?.model}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									Sim, excluir
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				<div className="flex items-center gap-2 ml-auto">
					<Button
						type="button"
						variant="outline"
						disabled={loading}
						onClick={handleCancel}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={loading}>
						{createCar.isPending || updateCar.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar veículo"}
					</Button>
				</div>
			</div>
		</form>
	)
}
