"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clientApi } from "@/lib/api/client"
import { routes } from "@/config/routes"
import { User } from "@/schemas/user"
import { toast } from "sonner"

export function useUserMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createUser = useMutation({
		mutationFn: (data: Partial<User>) =>
			clientApi(routes.users.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
			toast.success("Usuário criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar usuário")
		},
	})

	// UPDATE
	const updateUser = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
			clientApi(routes.users.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
			toast.success("Usuário atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Usuário não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteUser = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.users.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
			toast.success("Usuário excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Usuário já foi removido")
				return
			}

			toast.error(error.message || "Erro ao excluir usuário")
		},
	})

	return {
		createUser,
		updateUser,
		deleteUser,
	}
}
