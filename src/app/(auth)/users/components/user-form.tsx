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
import { User } from "@/schemas/User"
import { DriverProfileCreate } from "@/schemas/Driver"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { USER_LICENSE_TYPES } from "@/constants/Users"

interface UserFormProps {
	user?: User
	onSuccess?: () => void
	onCancel?: () => void
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
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

	// 👇 Popula com dados existentes se for edição de um motorista
	const [driverForm, setDriverForm] = useState<DriverProfileCreate>({
		license: user?.driver_profile?.license ?? "",
		type: user?.driver_profile?.type ?? "B",
		validity: user?.driver_profile?.validity ?? null,
		ear: user?.driver_profile?.ear ?? false,
	})

	const [passwordError, setPasswordError] = useState("")

	const isDriver = form.profile === "driver"

	function handleChange(field: keyof typeof form, value: string) {
		setForm((f) => ({ ...f, [field]: value }))
		if (field === "confirm_password" || field === "password") {
			setPasswordError("")
		}
	}

	function handleDriverChange(
		field: keyof DriverProfileCreate,
		value: string | boolean | Date | null,
	) {
		setDriverForm((f) => ({ ...f, [field]: value }))
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (form.password !== form.confirm_password) {
			setPasswordError("As senhas não coincidem")
			return
		}

		const { confirm_password, ...payload } = form

		try {
			if (isEdit) {
				await updateUser.mutateAsync({
					id: user!.id,
					data: {
						...payload,
						...(isDriver && { driver: driverForm }),
					},
				})
			} else {
				await createUser.mutateAsync({
					...payload,
					...(isDriver && { driver: driverForm }),
				})
			}
			onSuccess?.()
		} catch {}
	}

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
			{/* Avatar */}
			<div className="flex items-center gap-4">
				<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted text-muted-foreground">
					<Camera className="h-6 w-6" />
				</div>
				<div className="flex flex-col gap-1">
					<Button type="button" variant="outline" size="sm" disabled>
						Enviar foto
					</Button>
					<p className="text-xs text-muted-foreground">
						Upload de imagem em breve
					</p>
				</div>
			</div>

			{/* Nome + E-mail */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						placeholder="Nome completo"
						value={form.name}
						onChange={(e) => handleChange("name", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="email">E-mail</Label>
					<Input
						id="email"
						type="email"
						placeholder="E-mail"
						value={form.email}
						onChange={(e) => handleChange("email", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
			</div>

			{/* CPF + Telefone + Perfil */}
			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="cpf">CPF</Label>
					<Input
						id="cpf"
						placeholder="XXX.XXX.XXX-XX"
						value={form.cpf ?? ""}
						onChange={(e) => handleChange("cpf", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="phone">Telefone</Label>
					<Input
						id="phone"
						placeholder="(XX) XXXXX-XXXX"
						value={form.phone ?? ""}
						onChange={(e) => handleChange("phone", e.target.value)}
						disabled={loading}
					/>
				</div>
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
							<SelectItem value="admin">Administrador</SelectItem>
							<SelectItem value="operator">Operador</SelectItem>
							<SelectItem value="driver">Motorista</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* ───── Campos de Motorista ───── */}
			{isDriver && (
				<>
					<Separator />
					<div className="space-y-4">
						<p className="text-sm font-medium text-foreground">
							Dados do motorista
						</p>

						<div className="grid grid-cols-3 gap-2">
							<div className="space-y-1 col-span-2">
								<Label htmlFor="license">Número da CNH</Label>
								<Input
									id="license"
									placeholder="Número da CNH"
									value={driverForm.license}
									onChange={(e) =>
										handleDriverChange("license", e.target.value)
									}
									disabled={loading}
									required={isDriver}
								/>
							</div>

							<div className="space-y-1">
								<Label htmlFor="license-type">Categoria</Label>
								<Select
									value={driverForm.type}
									onValueChange={(v) => handleDriverChange("type", v)}
									disabled={loading}
								>
									<SelectTrigger id="license-type" className="w-full">
										<SelectValue placeholder="Categoria" />
									</SelectTrigger>
									<SelectContent>
										{USER_LICENSE_TYPES.map((t) => (
											<SelectItem key={t} value={t}>
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 items-end">
							<div className="space-y-1">
								<Label htmlFor="validity">Validade da CNH</Label>
								<Input
									id="validity"
									type="date"
									value={
										driverForm.validity
											? new Date(driverForm.validity)
													.toISOString()
													.substring(0, 10)
											: ""
									}
									onChange={(e) =>
										handleDriverChange(
											"validity",
											e.target.value ? new Date(e.target.value) : null,
										)
									}
									disabled={loading}
								/>
							</div>

							<div className="flex items-center gap-2 pb-2">
								<Checkbox
									id="ear"
									checked={driverForm.ear ?? false}
									onCheckedChange={(checked) =>
										handleDriverChange("ear", checked === true)
									}
									disabled={loading}
								/>
								<Label htmlFor="ear" className="cursor-pointer">
									Possui EAR
									<span className="ml-1 text-xs text-muted-foreground">
										(Exercício de Atividade Remunerada)
									</span>
								</Label>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Senha */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1">
					<Label htmlFor="password">Senha</Label>
					<Input
						id="password"
						type="password"
						placeholder={isEdit ? "Nova senha (opcional)" : "Senha"}
						value={form.password}
						onChange={(e) => handleChange("password", e.target.value)}
						disabled={loading}
						required={!isEdit}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="password-check">Confirmar Senha</Label>
					<Input
						id="password-check"
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

			{/* Ações */}
			<div className="flex justify-between items-center">
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

				<div className="flex items-center gap-2 ml-auto">
					<Button
						type="button"
						variant="outline"
						className="cursor-pointer"
						disabled={loading}
						onClick={onCancel}
					>
						Cancelar
					</Button>
					<Button type="submit" className="cursor-pointer" disabled={loading}>
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
