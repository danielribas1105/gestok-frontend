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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Camera } from "lucide-react"
import { useState } from "react"

interface CarFormProps {
	car?: Car
	onSuccess?: () => void
	onCancel?: () => void
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
		strength: car?.strength ?? "",
		capacity: car?.capacity ?? "",
		versatility: car?.versatility ?? "",
		active: car?.active ?? true,
	}

	const [form, setForm] = useState(initialForm)

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	//  CANCEL
	function handleCancel() {
		setForm(initialForm) // descarta qualquer alteração feita
		onCancel?.() // avisa o pai pra fechar o form/modal
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!form.driver_id) return // proteção extra, além do required do Select

		const payload = {
			...form,
			manufacture: form.manufacture ? parseInt(form.manufacture) : null,
			km: form.km ? parseInt(form.km) : null,
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
					<Label htmlFor="model">Modelo*</Label>
					<Input
						id="model"
						placeholder="Modelo"
						value={form.model}
						onChange={(e) => handleChange("model", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="driver">Motorista*</Label>
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

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="space-y-1">
					<Label htmlFor="capacity">Capacidade(m3)*</Label>
					<Input
						id="capacity"
						placeholder="Capacidade de carga"
						value={form.capacity}
						onChange={(e) => handleChange("capacity", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="strength">Potência</Label>
					<Input
						id="strength"
						placeholder="Potência (ex: 150cv)"
						value={form.strength}
						onChange={(e) => handleChange("strength", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="versatility">Versatilidade</Label>
					<Input
						id="versatility"
						placeholder="Versatilidade (ex: SUV, Pickup)"
						value={form.versatility}
						onChange={(e) => handleChange("versatility", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="status">Status</Label>
					<Select
						value={form.active ? "true" : "false"}
						onValueChange={(v) => handleChange("active", v === "true")}
						disabled={loading}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="true">Ativo</SelectItem>
							<SelectItem value="false">Inativo</SelectItem>
						</SelectContent>
					</Select>
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
