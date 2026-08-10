"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { OrderItemRow } from "@/types/Order"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export interface OrdersFilters {
	search?: string
	dateFrom?: string
	dateTo?: string
	status?: string
	clientId?: string
}

/**
 * Formato cru vindo do backend (GET /orders -> list[OrderResponse]),
 * confirmado contra app/modules/orders/schema.py.
 *
 * ATENÇÃO: OrderItemReadNested não expõe `product_id` — é um gap no
 * schema.py (só existe em OrderItemCreate/OrderItemCreatePayload).
 * Até isso ser corrigido no backend, não tem como ligar o item ao
 * produto, então product_name/product_code ficam com um aviso fixo.
 */
interface BackendOrderItem {
	id: string
	quantity: number
	total_price: number
	item_number?: string | null
	// product_id: NÃO existe hoje no OrderItemReadNested — ver aviso acima
}

interface BackendOrder {
	id: string
	branch_code: string
	code: string
	operation_type: string
	status: string
	client_id: string
	store_id: string
	saller_id: string // nome real do campo no backend (não "saller_id")
	supervisor_id: string
	manager_id: string
	issued_at?: string | null
	release_reason?: string | null
	released_at?: string | null
	created_at?: string | null
	updated_at?: string | null
	processed_at?: string | null
	observations?: string | null
	items: BackendOrderItem[]
}

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

			const orders = await clientApi<BackendOrder[]>(
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

		const issuedAt = order.issued_at ? new Date(order.issued_at) : null
		const processedAt = order.processed_at ? new Date(order.processed_at) : null

		items.forEach((item) => {
			// unit_value não existe no backend — deriva do total quando possível
			const unitValue = item.quantity ? item.total_price / item.quantity : 0

			flattenedRows.push({
				order_id: order.id,
				cod_order: order.code,
				order_type: order.operation_type as OrderItemRow["order_type"],
				order_type_label: getOperationLabel(order.operation_type),
				order_date: issuedAt?.toISOString(),
				order_date_formatted: issuedAt
					? issuedAt.toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})
					: "-",
				processed_date: processedAt?.toISOString(),
				processed_date_formatted: processedAt
					? processedAt.toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})
					: undefined,
				status: order.status as OrderItemRow["status"],
				status_label: getStatusLabel(order.status),
				observations: order.observations,

				// TODO: useOrdersViews resolve o nome real via useClients()/useUsers()
				client_id: order.client_id,
				client_name: order.client_id,

				saller_id: order.saller_id, // backend usa "saller_id" (typo)
				seller_name: order.saller_id,
				supervisor_id: order.supervisor_id,
				manager_id: order.manager_id,

				item_id: item.id,
				// BLOQUEADO: OrderItemReadNested não retorna product_id hoje
				// (ver aviso no schema.py) — sem isso não dá pra ligar ao produto
				product_id: "",
				product_code: "-",
				product_name: "Produto (aguardando product_id no backend)",
				product_unit: "-",
				quantity: item.quantity,
				unit_value: unitValue,
				item_total_value: item.total_price,

				total_order_items: totalOrderItems,
				total_order_value: totalOrderValue,

				raw_order: order as any,
				raw_item: item as any,
			})
		})
	})

	return flattenedRows
}

function getOperationLabel(type: string): string {
	const labels: Record<string, string> = {
		sale: "Venda",
		tasting: "Degustação",
		bonus: "Bonificação",
	}
	return labels[type] || type
}

function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		pending: "Pendente",
		processed: "Processado",
		blocked: "Bloqueado",
		in_transit: "Em Trânsito",
		canceled: "Cancelado",
		concluded: "Concluído",
	}
	return labels[status] || status
}
