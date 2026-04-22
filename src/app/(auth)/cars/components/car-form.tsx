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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useCarMutations } from "@/hooks/cars/use-car-mutations"
import { Car } from "@/schemas/car"
import { Camera } from "lucide-react"
import { useState } from "react"

interface CarFormProps {
	car?: Car
	onSuccess?: () => void
}

export default function CarForm({ car, onSuccess }: CarFormProps) {
	const isEdit = !!car
	const { createCar, updateCar, deleteCar } = useCarMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		model: car?.model ?? "",
		license: car?.license ?? "",
		manufacture: car?.manufacture?.toString() ?? "",
		km: car?.km?.toString() ?? "",
		fuel: car?.fuel ?? "",
		strength: car?.strength ?? "",
		capacity: car?.capacity ?? "",
		versatility: car?.versatility ?? "",
		active: car?.active ?? true,
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

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

			{/* Modelo + Placa */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					placeholder="Modelo"
					value={form.model}
					onChange={(e) => handleChange("model", e.target.value)}
					disabled={loading}
					required
				/>
				<Input
					placeholder="Placa (ex: ABC1D23)"
					value={form.license}
					onChange={(e) =>
						handleChange("license", e.target.value.toUpperCase())
					}
					disabled={loading}
					required
				/>
			</div>

			{/* Ano + KM */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					type="number"
					placeholder="Ano de fabricação"
					value={form.manufacture}
					onChange={(e) => handleChange("manufacture", e.target.value)}
					disabled={loading}
				/>
				<Input
					type="number"
					placeholder="Quilometragem (km)"
					value={form.km}
					onChange={(e) => handleChange("km", e.target.value)}
					disabled={loading}
				/>
			</div>

			{/* Combustível + Potência */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Select
					value={form.fuel}
					onValueChange={(v) => handleChange("fuel", v)}
					disabled={loading}
				>
					<SelectTrigger>
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

				<Input
					placeholder="Potência (ex: 150cv)"
					value={form.strength}
					onChange={(e) => handleChange("strength", e.target.value)}
					disabled={loading}
				/>
			</div>

			{/* Capacidade + Versatilidade */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					placeholder="Capacidade (ex: 5 pessoas)"
					value={form.capacity}
					onChange={(e) => handleChange("capacity", e.target.value)}
					disabled={loading}
				/>
				<Input
					placeholder="Versatilidade (ex: SUV, Pickup)"
					value={form.versatility}
					onChange={(e) => handleChange("versatility", e.target.value)}
					disabled={loading}
				/>
			</div>

			{/* Status */}
			<Select
				value={form.active ? "true" : "false"}
				onValueChange={(v) => handleChange("active", v === "true")}
				disabled={loading}
			>
				<SelectTrigger>
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="true">Ativo</SelectItem>
					<SelectItem value="false">Inativo</SelectItem>
				</SelectContent>
			</Select>

			{/* Actions */}
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

				<div className="ml-auto">
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
