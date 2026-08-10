"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Salesperson } from "@/schemas/Salesperson"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSalespersonMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createSalesperson = useMutation({
		mutationFn: (data: Partial<Salesperson>) =>
			clientApi(routes.salesperson.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["salesperson"] })
			toast.success("Vendedor/Gerente criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao cadastrar novo vendedor/gerente")
		},
	})

	// UPDATE
	const updateSalesperson = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Salesperson> }) =>
			clientApi(routes.salesperson.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["salesperson"] })
			toast.success("Vendedor/Gerente atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Vendedor/Gerente não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteSalesperson = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.salesperson.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["salesperson"] })
			toast.success("Vendedor/Gerente excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Vendedor/Gerente já foi removido")
				return
			}

			toast.error(error.message || "Erro ao excluir vendedor/gerente")
		},
	})

	return {
		createSalesperson,
		updateSalesperson,
		deleteSalesperson,
	}
}
