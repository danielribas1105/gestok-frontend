"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Work } from "@/schemas/work"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useWorkMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createWork = useMutation({
		mutationFn: (data: Partial<Work>) =>
			clientApi(routes.works.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["works"] })
			toast.success("Obra criada com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar obra")
		},
	})

	// UPDATE
	const updateWork = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Work> }) =>
			clientApi(routes.works.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["works"] })
			toast.success("Obra atualizada com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Obra não encontrada")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteWork = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.works.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["works"] })
			toast.success("Obra excluída 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Obra não encontrada")
				return
			}

			toast.error(error.message || "Erro ao excluir obra")
		},
	})

	return {
		createWork,
		updateWork,
		deleteWork,
	}
}
