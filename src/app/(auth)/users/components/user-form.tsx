"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useUserMutations } from "@/hooks/users/use-user-mutations"
import { User } from "@/schemas/user"
import { Camera } from "lucide-react"
import { useState } from "react"
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

interface UserFormProps {
	user?: User
	onSuccess?: () => void
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
	const isEdit = !!user

	const { createUser, updateUser, deleteUser } = useUserMutations()

	const [form, setForm] = useState({
		name: user?.name ?? "",
		email: user?.email ?? "",
		cpf: user?.cpf ?? "",
		phone: user?.phone ?? "",
		profile: user?.profile ?? "operator",
		password: "",
		confirm_password: "",
	})

	const [passwordError, setPasswordError] = useState("")

	function handleChange(field: keyof typeof form, value: string) {
		setForm((f) => ({ ...f, [field]: value }))
		if (field === "confirm_password" || field === "password") {
			setPasswordError("")
		}
	}

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (form.password !== form.confirm_password) {
			setPasswordError("As senhas não coincidem")
			return
		}

		const { confirm_password, ...payload } = form

		try {
			if (isEdit) {
				await updateUser.mutateAsync({ id: user!.id, data: payload })
			} else {
				await createUser.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!user) return

		try {
			await deleteUser.mutateAsync(user.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createUser.isPending || updateUser.isPending || deleteUser.isPending

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

			{/* Campos principais */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					placeholder="Nome completo"
					value={form.name}
					onChange={(e) => handleChange("name", e.target.value)}
					disabled={loading}
					required
				/>
				<Input
					type="email"
					placeholder="E-mail"
					value={form.email}
					onChange={(e) => handleChange("email", e.target.value)}
					disabled={loading}
					required
				/>
				<Input
					placeholder="CPF (XXX.XXX.XXX-XX)"
					value={form.cpf}
					onChange={(e) => handleChange("cpf", e.target.value)}
					disabled={loading}
				/>
				<Input
					placeholder="Telefone ((XX) XXXXX-XXXX)"
					value={form.phone}
					onChange={(e) => handleChange("phone", e.target.value)}
					disabled={loading}
				/>
			</div>

			<Select
				value={form.profile}
				onValueChange={(v) => handleChange("profile", v)}
				disabled={loading}
			>
				<SelectTrigger>
					<SelectValue placeholder="Perfil" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="operator">Operador</SelectItem>
					<SelectItem value="admin">Administrador</SelectItem>
					<SelectItem value="driver">Motorista</SelectItem>
				</SelectContent>
			</Select>

			{/* Senha */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					type="password"
					placeholder={isEdit ? "Nova senha (opcional)" : "Senha"}
					value={form.password}
					onChange={(e) => handleChange("password", e.target.value)}
					disabled={loading}
					required={!isEdit}
				/>
				<div className="flex flex-col gap-1">
					<Input
						type="password"
						placeholder="Confirmar senha"
						value={form.confirm_password}
						onChange={(e) => handleChange("confirm_password", e.target.value)}
						disabled={loading}
						required={!isEdit}
					/>
					{passwordError && (
						<p className="text-xs text-destructive">{passwordError}</p>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteUser.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o usuário <strong>{user?.name}</strong>.
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

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createUser.isPending || updateUser.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar usuário"}
					</Button>
				</div>
			</div>
		</form>
	)
}
