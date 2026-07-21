"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Client } from "@/schemas/Client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useClientMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createClient = useMutation({
		mutationFn: (data: Partial<Client>) =>
			clientApi(routes.clients.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] })
			toast.success("Cliente criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao cadastrar novo cliente")
		},
	})

	// UPDATE
	const updateClient = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
			clientApi(routes.clients.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] })
			toast.success("Cliente atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Cliente não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteClient = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.clients.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] })
			toast.success("Cliente excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Cliente já foi removido")
				return
			}

			toast.error(error.message || "Erro ao excluir cliente")
		},
	})

	return {
		createClient,
		updateClient,
		deleteClient,
	}
}
