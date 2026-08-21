"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { queryKeys } from "@/lib/query-keys"
import { Order } from "@/schemas/Order"
import { OrderCreatePayload } from "@/types/Order"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useOrderMutations() {
	const queryClient = useQueryClient()

	const createOrdersBatch = useMutation({
		mutationFn: (orders: OrderCreatePayload[]) =>
			clientApi(routes.orders.createBatch, {
				method: "POST",
				body: JSON.stringify({ orders }),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw })
			toast.success("Pedidos importados com sucesso 🎉")
		},
		onError: (error: any) => {
			toast.error(error.message || "Erro ao importar pedidos")
		},
	})

	const createOrder = useMutation({
		mutationFn: (data: Partial<OrderCreatePayload>) =>
			clientApi(routes.orders.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw })
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

	const updateOrder = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
			clientApi(routes.orders.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw })
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

	const deleteOrder = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.orders.delete(id), {
				method: "DELETE",
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw })
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

	const setStockHold = useMutation({
		mutationFn: ({
			orderId,
			stockHold,
			reason,
		}: {
			orderId: string
			stockHold: boolean
			reason?: string
		}) =>
			clientApi(routes.orders.setStockHold(orderId), {
				method: "PATCH",
				body: JSON.stringify({ stock_hold: stockHold, reason }),
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw })
			toast.success("Estoque do pedido atualizado")
		},
		onError: (error: any) => {
			toast.error(error.message || "Erro ao atualizar hold de estoque")
		},
	})

	return {
		createOrdersBatch,
		createOrder,
		updateOrder,
		deleteOrder,
		setStockHold,
	}
}
