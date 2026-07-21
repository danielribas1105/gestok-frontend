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
import { useClientMutations } from "@/hooks/clients/use-client-mutations"
import { Client } from "@/schemas/Client"
import { formatDate } from "@/utils/format-date"
import { RadioGroup } from "radix-ui"
import { useState } from "react"

interface ClientFormProps {
	client?: Client
	onSuccess?: () => void
	onCancel?: () => void
}

export default function ClientForm({
	client,
	onSuccess,
	onCancel,
}: ClientFormProps) {
	const isEdit = !!client
	const { createClient, updateClient, deleteClient } = useClientMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		code: client?.code ?? "",
		name: client?.name ?? "",
		trade_name: client?.trade_name ?? "",
		cnpj: client?.cnpj ?? "",
		insc_e: client?.insc_e ?? "",
		phone: client?.phone ?? "",
		contact: client?.contact ?? "",
		address: client?.address ?? "",
		region: client?.region ?? "",
		zip_code: client?.zip_code ?? "",
		city: client?.city ?? "",
		state: client?.state ?? "",
		active: client?.active ?? true,
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
				await updateClient.mutateAsync({ id: client!.id, data: payload })
			} else {
				await createClient.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!client) return
		try {
			await deleteClient.mutateAsync(client.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createClient.isPending || updateClient.isPending || deleteClient.isPending

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
						disabled={loading}
						required
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="name">Nome *</Label>
					<Input
						id="name"
						placeholder="Nome do cliente"
						value={form.name}
						onChange={(e) => handleChange("name", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-2">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="trade_name">Nome Fantasia</Label>
					<Input
						id="trade_name"
						placeholder="Nome fantasia do cliente"
						value={form.trade_name}
						onChange={(e) => handleChange("trade_name", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="cnpj">CNPJ</Label>
					<Input
						id="cnpj"
						placeholder="Digite apenas números"
						value={form.cnpj}
						onChange={(e) => handleChange("cnpj", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="insc_e">Inscrição Estadual</Label>
					<Input
						id="insc_e"
						placeholder="Digite apenas números"
						value={form.insc_e}
						onChange={(e) => handleChange("insc_e", e.target.value)}
						disabled={loading}
					/>
				</div>
			</div>

			<div className="space-y-1">
				<Label htmlFor="address">Endereço</Label>
				<Input
					id="address"
					placeholder="Rua, número, complemento"
					value={form.address}
					onChange={(e) => handleChange("address", e.target.value)}
					disabled={loading}
				/>
			</div>

			<div className="grid grid-cols-4 gap-4">
				<div className="space-y-1">
					<Label htmlFor="zip_code">CEP</Label>
					<Input
						id="zip_code"
						placeholder="Digite apenas números"
						value={form.zip_code}
						onChange={(e) => handleChange("zip_code", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="region">Bairro</Label>
					<Input
						id="region"
						placeholder="Bairro"
						value={form.region}
						onChange={(e) => handleChange("region", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="city">Cidade</Label>
					<Input
						id="city"
						placeholder="Cidade"
						value={form.city}
						onChange={(e) => handleChange("city", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="state">Estado</Label>
					<Input
						id="state"
						placeholder="UF"
						value={form.state}
						onChange={(e) => handleChange("state", e.target.value)}
						disabled={loading}
						maxLength={2}
						className="uppercase"
					/>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-4">
				<div className="space-y-1">
					<Label htmlFor="contact">Contato</Label>
					<Input
						id="contact"
						placeholder="Nome para contato"
						value={form.contact}
						onChange={(e) => handleChange("contact", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="phone">Telefone</Label>
					<Input
						id="phone"
						placeholder="Telefone para contato"
						value={form.phone}
						onChange={(e) => handleChange("phone", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="created_at">Data de Cadastro</Label>
					<Input
						id="created_at"
						placeholder="Data de cadastro"
						value={
							isEdit
								? formatDate(client?.created_at ?? "")
								: new Date().toLocaleDateString("pt-BR")
						}
						disabled
					/>
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
								{deleteClient.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o cliente <strong>{client?.name}</strong>.
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
						{createClient.isPending || updateClient.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar Cliente"}
					</Button>
				</div>
			</div>
		</form>
	)
}
