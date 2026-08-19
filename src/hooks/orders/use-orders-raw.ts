"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { BackendOrder, OrderItemRow, OrdersFilters } from "@/types/Order"
import { useQuery, useQueryClient } from "@tanstack/react-query"

/**
 * Fonte única de verdade dos pedidos.
 *
 * O endpoint GET /orders hoje só aceita `offset`/`limit` e retorna um
 * ARRAY PURO (list[OrderResponse]) — sem wrapper { orders, total, ... }
 * e sem suporte a search/date_from/date_to/status/client_id no servidor.
 * Por isso: paginamos com limit alto pra trazer tudo de uma vez, e
 * aplicamos os filtros no array já carregado (client-side) até o
 * backend ganhar suporte real a esses parâmetros.
 */
export const useOrdersRaw = (filters: OrdersFilters = {}) => {
	const queryClient = useQueryClient()

	const query = useQuery({
		queryKey: ["orders-raw", filters],
		queryFn: async (): Promise<OrderItemRow[]> => {
			const params = new URLSearchParams()
			params.append("limit", "5000")
			params.append("offset", "0")

			const orders = await clientApi(
				`${routes.orders.list}?${params.toString()}`,
			)

			if (!orders || orders.length === 0) return []

			let rows = flattenOrders(orders)

			// Filtro client-side temporário (o backend ainda não filtra)
			if (filters.status) {
				rows = rows.filter((r) => r.status === filters.status)
			}
			if (filters.clientId) {
				rows = rows.filter((r) => r.client_id === filters.clientId)
			}
			if (filters.search) {
				const term = filters.search.toLowerCase()
				rows = rows.filter(
					(r) =>
						r.cod_order.toLowerCase().includes(term) ||
						r.product_name.toLowerCase().includes(term),
				)
			}
			if (filters.dateFrom) {
				const from = new Date(filters.dateFrom).getTime()
				rows = rows.filter(
					(r) => r.order_date && new Date(r.order_date).getTime() >= from,
				)
			}
			if (filters.dateTo) {
				const to = new Date(filters.dateTo).getTime()
				rows = rows.filter(
					(r) => r.order_date && new Date(r.order_date).getTime() <= to,
				)
			}

			return rows
		},
		staleTime: 60_000,
	})

	const refreshOrders = async () => {
		await queryClient.invalidateQueries({ queryKey: ["orders-raw"] })
	}

	return {
		...query,
		rows: query.data ?? [],
		refreshOrders,
	}
}

function flattenOrders(orders: BackendOrder[]): OrderItemRow[] {
	const flattenedRows: OrderItemRow[] = []

	orders.forEach((order) => {
		const items = order.items ?? []

		const totalOrderValue = items.reduce(
			(sum, item) => sum + item.total_price,
			0,
		)
		const totalOrderItems = items.length
		const totalQuantityOrder = items.reduce(
			(sum, item) => sum + item.quantity,
			0,
		)

		const issuedAt = order.issued_at ? new Date(order.issued_at) : null
		const processedAt = order.processed_at ? new Date(order.processed_at) : null

		items.forEach((item) => {
			// unit_value não existe no backend — deriva do total quando possível
			const unitValue = item.quantity ? item.total_price / item.quantity : 0

			flattenedRows.push({
				client_id: order.client_id,
				client_name: order.client_name ?? "Não cadastrado",
				cod_order: order.code,
				item_id: item.id,
				item_total_value: item.total_price,
				manager_id: order.manager_id,
				manager_name: order.manager_name ?? "Não cadastrado",
				observations: order.observations,
				operation_type: order.operation_type as OrderItemRow["operation_type"],
				order_date: issuedAt?.toISOString(),
				order_id: order.id,
				processed_date: processedAt?.toISOString(),
				status: order.status as OrderItemRow["status"],

				saller_id: order.saller_id,
				seller_name: order.saller_name ?? "Não cadastrado",
				supervisor_id: order.supervisor_id,
				supervisor_name: order.supervisor_name ?? "Não cadastrado",

				product_id: item.product_id,
				product_name_code: item.product_name_code ?? "-",
				product_name: item.product_name ?? "Produto sem nome",
				product_code: item.product_code ?? "Produto sem código",
				product_unit: item.product_unit ?? "-",
				product_weight: Number(item.product_weight) ?? 0,
				product_volume: Number(item.product_volume) ?? 0,
				product_boxes_pallet: Number(item.product_boxes_pallet) ?? 0,
				quantity: item.quantity,
				unit_value: unitValue,
				item_total_weight: Number(item.product_weight) * item.quantity,
				item_total_volume: Number(item.product_volume) * item.quantity,

				total_order_items: totalOrderItems,
				total_order_value: totalOrderValue,
				total_order_quantity: totalQuantityOrder,

				store_id: order.store_id,
				store_name: order.store_name ?? "Não cadastrado",
				branch_code: order.branch_code,
				release_reason: order.release_reason,
				released_at: order.released_at,
				created_at: order.created_at,
			})
		})
	})

	return flattenedRows
}
