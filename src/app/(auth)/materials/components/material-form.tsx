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
import { useMaterialMutations } from "@/hooks/materials/use-material-mutations"
import { useWorkMutations } from "@/hooks/works/use-work-mutations"
import { Material } from "@/schemas/material"
import { Work } from "@/schemas/work"
import { useState } from "react"

interface MaterialFormProps {
	material?: Material
	onSuccess?: () => void
}

export default function MaterialForm({
	material,
	onSuccess,
}: MaterialFormProps) {
	const isEdit = !!material

	const { createMaterial, updateMaterial, deleteMaterial } =
		useMaterialMutations()

	const [form, setForm] = useState({
		name: material?.name || "",
		description: material?.description || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateMaterial.mutateAsync({
					id: material!.id,
					data: form,
				})
			} else {
				await createMaterial.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!material) return

		try {
			await deleteMaterial.mutateAsync(material.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createMaterial.isPending ||
		updateMaterial.isPending ||
		deleteMaterial.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="Nome"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Descrição"
				value={form.description}
				onChange={(e) => setForm({ ...form, description: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteMaterial.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o material <strong>{material?.name}</strong>.
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
						{createMaterial.isPending || updateMaterial.isPending
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
