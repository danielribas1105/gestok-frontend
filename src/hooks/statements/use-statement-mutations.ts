"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Statement } from "@/schemas/statements"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useStatementMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createStatement = useMutation({
		mutationFn: (data: Partial<Statement>) =>
			clientApi(routes.statements.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["statements"] })
			toast.success("Manifesto criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar manifesto")
		},
	})

	// UPDATE
	const updateStatement = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Statement> }) =>
			clientApi(routes.statements.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["statements"] })
			toast.success("Manifesto atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Manifesto não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteStatement = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.statements.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["statements"] })
			toast.success("Manifesto excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Manifesto não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir manifesto")
		},
	})

	return {
		createStatement,
		updateStatement,
		deleteStatement,
	}
}
