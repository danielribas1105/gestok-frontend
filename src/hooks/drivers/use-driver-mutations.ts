"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Driver } from "@/schemas/Driver"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDriverMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createDriver = useMutation({
		mutationFn: (data: Partial<Driver>) =>
			clientApi(routes.drivers.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drivers"] })
			toast.success("Motorista criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao cadastrar novo motorista")
		},
	})

	// UPDATE
	const updateDriver = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Driver> }) =>
			clientApi(routes.drivers.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drivers"] })
			toast.success("Motorista atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Motorista não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteDriver = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.drivers.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drivers"] })
			toast.success("Motorista excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Motorista já foi removido")
				return
			}

			toast.error(error.message || "Erro ao excluir motorista")
		},
	})

	return {
		createDriver,
		updateDriver,
		deleteDriver,
	}
}
