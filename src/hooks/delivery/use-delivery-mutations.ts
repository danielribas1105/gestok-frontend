"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { DeliveryCreatePayload } from "@/types/Delivery"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeliveryMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createDelivery = useMutation({
		mutationFn: (delivery: Partial<DeliveryCreatePayload>[]) =>
			clientApi(routes.delivery.create, {
				method: "POST",
				body: JSON.stringify(delivery),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery"] })
			toast.success("Entrega(s) criada(s) com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar entrega")
		},
	})

	// UPDATE
	const updateDelivery = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Partial<DeliveryCreatePayload>
		}) =>
			clientApi(routes.delivery.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery"] })
			toast.success("Entrega atualizada com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Entrega não encontrada")
				return
			}

			toast.error(error.message || "Erro ao atualizar entrega")
		},
	})

	// DELETE
	const deleteDelivery = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.delivery.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery"] })
			toast.success("Entrega excluída 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Essa entrega já foi removida")
				return
			}

			toast.error(error.message || "Erro ao excluir entrega")
		},
	})

	return {
		createDelivery,
		updateDelivery,
		deleteDelivery,
	}
}
