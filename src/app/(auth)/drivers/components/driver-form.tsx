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
import { RadioGroupItem } from "@/components/ui/radio-group"
import { useDriverMutations } from "@/hooks/drivers/use-driver-mutations"
import { Driver, LICENSE_TYPES, LicenseTypeEnum } from "@/schemas/Driver"
import {
	formatDataInput,
	formatDate,
	formatDateToMask,
	parseDataStringToISO,
} from "@/utils/format-date"
import { formatCPFInput } from "@/utils/validate-cpf"
import { formatPhoneInput } from "@/utils/validate-phone"
import { RadioGroup } from "radix-ui"
import { useState } from "react"

interface DriverFormProps {
	driver?: Driver
	onSuccess?: () => void
	onCancel?: () => void
}

export default function DriverForm({
	driver,
	onSuccess,
	onCancel,
}: DriverFormProps) {
	const isEdit = !!driver
	const { createDriver, updateDriver, deleteDriver } = useDriverMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		name: driver?.name ?? "",
		license: driver?.license ?? "",
		type: (driver?.type ?? "B") as LICENSE_TYPES,
		validity: formatDateToMask(driver?.validity),
		ear: driver?.ear ?? false,
		cpf: driver?.cpf ?? "",
		phone: driver?.phone ?? "",
		active: driver?.active ?? true,
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!LicenseTypeEnum.safeParse(form.type).success) {
			console.error("Categoria de CNH inválida:", form.type)
			return
		}

		const isoValidity = parseDataStringToISO(form.validity as string)
		if (form.validity && !isoValidity) {
			console.error("Data de validade CNH inválida:", form.validity)
			return
		}

		const payload = {
			...form,
			type: form.type,
			validity: isoValidity ? new Date(isoValidity) : null,
		}

		try {
			if (isEdit) {
				await updateDriver.mutateAsync({ id: driver!.id, data: payload })
			} else {
				await createDriver.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!driver) return
		try {
			await deleteDriver.mutateAsync(driver.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createDriver.isPending || updateDriver.isPending || deleteDriver.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="license">CNH *</Label>
					<Input
						id="license"
						placeholder="Número da CNH"
						value={form.license}
						onChange={(e) => handleChange("license", e.target.value)}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="type-license">Categoria *</Label>
					<RadioGroup.Root
						id="type-license"
						value={form.type}
						onValueChange={(v) => handleChange("type", v as LICENSE_TYPES)}
						className="flex items-center gap-4 h-9"
					>
						{LicenseTypeEnum.options.map((option) => (
							<div key={option} className="flex items-center gap-2">
								<RadioGroupItem
									value={option}
									id={`type-${option.toLowerCase()}`}
								/>
								<Label
									htmlFor={`type-${option.toLowerCase()}`}
									className="font-normal"
								>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup.Root>
				</div>
				<div className="space-y-1">
					<Label htmlFor="validity">Validade</Label>
					<Input
						id="validity"
						placeholder="dd/mm/aa"
						inputMode="numeric"
						maxLength={8}
						value={form.validity}
						onChange={(e) =>
							handleChange("validity", formatDataInput(e.target.value))
						}
						disabled={loading}
					/>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="name">Nome *</Label>
					<Input
						id="name"
						placeholder="Nome do motorista"
						value={form.name}
						onChange={(e) => handleChange("name", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="cpf-driver">CPF</Label>
					<Input
						id="cpf-driver"
						placeholder="xxx.xxx.xxx-xx"
						inputMode="numeric"
						maxLength={14}
						value={form.cpf}
						onChange={(e) =>
							handleChange("cpf", formatCPFInput(e.target.value))
						}
						disabled={loading}
					/>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-4">
				<div className="space-y-1">
					<Label htmlFor="phone-driver">Telefone</Label>
					<Input
						id="phone-driver"
						placeholder="(xx) xxxxx-xxxx"
						inputMode="numeric"
						maxLength={15}
						value={form.phone}
						onChange={(e) =>
							handleChange("phone", formatPhoneInput(e.target.value))
						}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="created_at">Data de Cadastro</Label>
					<Input
						id="created_at"
						placeholder="Data de cadastro"
						value={
							isEdit && driver?.created_at
								? formatDate(driver.created_at)
								: new Date().toLocaleDateString("pt-BR")
						}
						disabled
					/>
				</div>
				<div className="space-y-1">
					<Label>EAR</Label>
					<RadioGroup.Root
						value={form.ear ? "true" : "false"}
						onValueChange={(v) => handleChange("ear", v === "true")}
						disabled={loading}
						className="flex items-center gap-4 h-9"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="true" id="ear-true" />
							<Label htmlFor="ear-true" className="font-normal">
								Sim
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="false" id="ear-false" />
							<Label htmlFor="ear-false" className="font-normal">
								Não
							</Label>
						</div>
					</RadioGroup.Root>
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<RadioGroup.Root
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
					</RadioGroup.Root>
				</div>
			</div>

			<div className="flex items-center justify-between">
				{isEdit && (
					<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteDriver.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o motorista <strong>{driver?.name}</strong>.
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
						onClick={onCancel}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={loading}>
						{createDriver.isPending || updateDriver.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar Motorista"}
					</Button>
				</div>
			</div>
		</form>
	)
}
