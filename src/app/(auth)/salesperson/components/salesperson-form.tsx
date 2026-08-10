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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useSalespersonMutations } from "@/hooks/salesperson/use-salesperson-mutations"
import { Salesperson } from "@/schemas/Salesperson"
import { formatDate } from "@/utils/format-date"
import { formatPhoneInput } from "@/utils/validate-phone"
import { useState } from "react"

interface SalespersonFormProps {
	salesperson?: Salesperson
	onSuccess?: () => void
	onCancel?: () => void
}

export default function SalespersonForm({
	salesperson,
	onSuccess,
	onCancel,
}: SalespersonFormProps) {
	const isEdit = !!salesperson
	const { createSalesperson, updateSalesperson, deleteSalesperson } =
		useSalespersonMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		code: salesperson?.code ?? "",
		name: salesperson?.name ?? "",
		trade_name: salesperson?.trade_name ?? "",
		phone: salesperson?.phone ?? "",
		active: salesperson?.active ?? true,
		profile: salesperson?.profile ?? "seller",
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			...form,
		}

		try {
			if (isEdit) {
				await updateSalesperson.mutateAsync({
					id: salesperson!.id,
					data: payload,
				})
			} else {
				await createSalesperson.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!salesperson) return
		try {
			await deleteSalesperson.mutateAsync(salesperson.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createSalesperson.isPending ||
		updateSalesperson.isPending ||
		deleteSalesperson.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="code">Código *</Label>
					<Input
						id="code"
						placeholder="Digite o código do cliente"
						value={form.code}
						onChange={(e) => handleChange("code", e.target.value)}
						disabled={loading || isEdit}
						required
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="name-salesperson">Nome *</Label>
					<Input
						id="name-salesperson"
						placeholder="Nome do vendedor/supervisor/gerente"
						value={form.name}
						onChange={(e) => handleChange("name", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-2">
				<div className="col-span-3 space-y-1">
					<Label htmlFor="trade-name-salesperson">Nome Fantasia</Label>
					<Input
						id="trade-name-salesperson"
						placeholder="Nome fantasia"
						value={form.trade_name}
						onChange={(e) => handleChange("trade_name", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="phone-salesperson">Telefone</Label>
					<Input
						id="phone-salesperson"
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
			</div>

			<div className="grid grid-cols-4 gap-4">
				<div className="space-y-1">
					<Label htmlFor="profile">Perfil</Label>
					<Select
						value={form.profile}
						onValueChange={(v) => handleChange("profile", v)}
						disabled={loading}
					>
						<SelectTrigger id="profile" className="w-full">
							<SelectValue placeholder="Perfil" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="seller">Vendedor</SelectItem>
							<SelectItem value="supervisor">Supervisor</SelectItem>
							<SelectItem value="manager">Gerente</SelectItem>
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
				<div className="space-y-1">
					<Label htmlFor="created_at">Data de Cadastro</Label>
					<Input
						id="created_at"
						placeholder="Data de cadastro"
						value={
							isEdit
								? formatDate(salesperson?.created_at ?? "")
								: new Date().toLocaleDateString("pt-BR")
						}
						disabled
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				{isEdit && (
					<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteSalesperson.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o vendedor/gerente{" "}
									<strong>{salesperson?.name}</strong>.
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
						{createSalesperson.isPending || updateSalesperson.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar Vendedor/Gerente"}
					</Button>
				</div>
			</div>
		</form>
	)
}
