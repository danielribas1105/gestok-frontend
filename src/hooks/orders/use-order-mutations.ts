"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { OrderCreatePayload, OrderProcessResponse } from "./use-orders"
import { Order } from "@/schemas/Order"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useOrderMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createOrder = useMutation({
		mutationFn: (data: OrderCreatePayload) =>
			clientApi<Order>(routes.orders.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			toast.success("Pedido criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar pedido")
		},
	})

	// UPDATE
	const updateOrder = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: Partial<OrderCreatePayload>
		}) =>
			clientApi<Order>(routes.orders.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			toast.success("Pedido atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Pedido não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// PROCESS
	const processOrder = useMutation({
		mutationFn: (id: string) =>
			clientApi<OrderProcessResponse>(routes.orders.process(id), {
				method: "POST",
			}),

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			toast.success(data.message || "Pedido processado com sucesso ✅")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Pedido não encontrado")
				return
			}

			toast.error(error.message || "Erro ao processar pedido")
		},
	})

	// DELETE
	const deleteOrder = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.orders.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			toast.success("Pedido excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Pedido não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir pedido")
		},
	})

	return {
		createOrder,
		updateOrder,
		processOrder,
		deleteOrder,
	}
}
