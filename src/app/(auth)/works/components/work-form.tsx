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
import { useWorkMutations } from "@/hooks/works/use-work-mutations"
import { Work } from "@/schemas/work"
import { useState } from "react"

interface WorkFormProps {
	work?: Work
	onSuccess?: () => void
}

export default function WorkForm({ work, onSuccess }: WorkFormProps) {
	const isEdit = !!work

	const { createWork, updateWork, deleteWork } = useWorkMutations()

	const [form, setForm] = useState({
		name: work?.name || "",
		description: work?.description || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateWork.mutateAsync({
					id: work!.id,
					data: form,
				})
			} else {
				await createWork.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!work) return

		try {
			await deleteWork.mutateAsync(work.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createWork.isPending || updateWork.isPending || deleteWork.isPending

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
								{deleteWork.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente a obra <strong>{work?.name}</strong>.
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
						{createWork.isPending || updateWork.isPending
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
