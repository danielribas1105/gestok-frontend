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
import { useMaterials } from "@/hooks/materials/use-materials"
import { useStatementMutations } from "@/hooks/statements/use-statement-mutations"
import { Statement, StatementStatusEnum } from "@/schemas/statement"
import { useState } from "react"

interface StatementFormProps {
	statement?: Statement
	onSuccess?: () => void
}

const STATUS_LABELS: Record<
	(typeof StatementStatusEnum.options)[number],
	string
> = {
	pending: "Pendente",
	approved: "Aprovado",
	rejected: "Rejeitado",
	in_progress: "Em andamento",
	concluded: "Concluído",
}

export default function StatementForm({
	statement,
	onSuccess,
}: StatementFormProps) {
	const isEdit = !!statement

	const { createStatement, updateStatement, deleteStatement } =
		useStatementMutations()

	const { data: materials = [], isLoading: isLoadingMaterials } = useMaterials()

	const [form, setForm] = useState({
		code: statement?.code ?? "",
		material_id: statement?.material_id ?? "",
		m3: statement?.m3?.toString() ?? "",
		status: statement?.status ?? ("pending" as Statement["status"]),
		active: statement?.active ?? true,
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			code: form.code,
			material_id: form.material_id,
			m3: parseFloat(form.m3),
			status: form.status,
			active: form.active,
		}

		try {
			if (isEdit) {
				await updateStatement.mutateAsync({ id: statement!.id, data: payload })
			} else {
				await createStatement.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!statement) return
		try {
			await deleteStatement.mutateAsync(statement.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createStatement.isPending ||
		updateStatement.isPending ||
		deleteStatement.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Código */}
			<Input
				placeholder="Código"
				value={form.code}
				onChange={(e) => handleChange("code", e.target.value)}
				disabled={loading}
			/>

			{/* Material */}
			<Select
				value={form.material_id}
				onValueChange={(value) => handleChange("material_id", value)}
				disabled={loading || isLoadingMaterials}
			>
				<SelectTrigger>
					<SelectValue
						placeholder={
							isLoadingMaterials
								? "Carregando materiais..."
								: "Selecione o material"
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{materials.map((material) => (
						<SelectItem key={material.id} value={material.id}>
							{material.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* M3 */}
			<Input
				type="number"
				placeholder="Quantidade (m³)"
				value={form.m3}
				onChange={(e) => handleChange("m3", e.target.value)}
				disabled={loading}
				min={0}
				step="0.01"
			/>

			{/* Status */}
			<Select
				value={form.status}
				onValueChange={(value) =>
					handleChange("status", value as Statement["status"])
				}
				disabled={loading}
			>
				<SelectTrigger>
					<SelectValue placeholder="Selecione o status" />
				</SelectTrigger>
				<SelectContent>
					{StatementStatusEnum.options.map((status) => (
						<SelectItem key={status} value={status}>
							{STATUS_LABELS[status]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteStatement.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o manifesto <strong>{statement?.code}</strong>
									.
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
						{createStatement.isPending || updateStatement.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar"}
					</Button>
				</div>
			</div>
		</form>
	)
}
