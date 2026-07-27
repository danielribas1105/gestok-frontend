"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Order } from "@/schemas/Order"
import { Product } from "@/schemas/Product"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export interface OrderItem {
	id: string
	order_id: string
	product_id: string
	quantity: number
	unit_value: number
	total_value: number
	product?: Product
}

export interface OrdersResponse {
	orders: Order[]
	total: number
	page: number
	page_size: number
	total_pages: number
}

export interface OrderCreateItem {
	product_id: string
	quantity: number
	unit_value: number
}

export interface OrderCreatePayload {
	cod_order: number
	client_id: string
	order_type: "BONIFICACAO" | "DEGUSTACAO" | "VENDA"
	observations?: string
	items: OrderCreateItem[]
}

export interface OrderProcessResponse {
	success: boolean
	message: string
	order: Order
	movements_created: number
}

// Flattened Order Item Row - cada linha representa um item de pedido
export interface OrderItemRow {
	order_id: string
	cod_order: number
	order_type: "BONIFICACAO" | "DEGUSTACAO" | "VENDA"
	order_type_label: string
	order_date: string
	order_date_formatted: string
	processed_date?: string
	processed_date_formatted?: string
	status: "PENDENTE" | "PROCESSADO" | "CANCELADO"
	status_label: string
	observations?: string

	client_id: string
	client_name: string
	client_code: string
	client_cpf_cnpj?: string
	client_phone?: string
	client_email?: string

	user_id: string
	user_name: string
	user_email: string

	item_id: string
	product_id: string
	product_code: string
	product_name: string
	product_unit: string
	quantity: number
	unit_value: number
	item_total_value: number

	total_order_items: number
	total_order_value: number

	raw_order: Order
	raw_item: OrderItem
}

interface FlattenedOrdersResult {
	rows: OrderItemRow[]
	total: number
	page: number
	page_size: number
	total_pages: number
	total_rows: number
}

export const useOrders = (
	page: number = 1,
	pageSize: number = 20,
	search?: string,
) => {
	const queryClient = useQueryClient()

	const query = useQuery({
		queryKey: ["orders", page, pageSize, search],
		queryFn: async (): Promise<FlattenedOrdersResult> => {
			const params = new URLSearchParams({
				page: page.toString(),
				page_size: pageSize.toString(),
			})

			if (search) {
				params.append("search", search)
			}

			const ordersData = await clientApi<OrdersResponse>(
				`${routes.orders.list}?${params.toString()}`,
			)

			if (!ordersData?.orders) {
				return {
					rows: [],
					total: 0,
					page,
					page_size: pageSize,
					total_pages: 0,
					total_rows: 0,
				}
			}

			const flattenedRows: OrderItemRow[] = []

			ordersData.orders.forEach((order) => {
				const totalOrderValue = order.order_items.reduce(
					(sum, item) => sum + item.total_value,
					0,
				)
				const totalOrderItems = order.order_items.length

				order.order_items.forEach((item) => {
					flattenedRows.push({
						order_id: order.id,
						cod_order: order.cod_order,
						order_type: order.order_type,
						order_type_label:
							order.order_type === "VENDA" ? "Venda" : "Degustação",
						order_date: order.order_date,
						order_date_formatted: new Date(order.order_date).toLocaleDateString(
							"pt-BR",
							{
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							},
						),
						processed_date: order.processed_date || undefined,
						processed_date_formatted: order.processed_date
							? new Date(order.processed_date).toLocaleDateString("pt-BR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})
							: undefined,
						status: order.status,
						status_label: getStatusLabel(order.status),
						observations: order.observations,

						client_id: order.client_id,
						client_name: order.client?.client || "Cliente não encontrado",
						client_code: order.client?.cod_client || "-",
						client_cpf_cnpj: order.client?.cpf_cnpj,
						client_phone: order.client?.phone,
						client_email: order.client?.email,

						user_id: order.user_id,
						user_name: order.user?.name || "Usuário não encontrado",
						user_email: order.user?.email || "-",

						item_id: item.id,
						product_id: item.product_id,
						product_code: item.product?.cod_product || "-",
						product_name: item.product?.description || "Produto desconhecido",
						product_unit: item.product?.unit || "-",
						quantity: item.quantity,
						unit_value: item.unit_value,
						item_total_value: item.total_value,

						total_order_items: totalOrderItems,
						total_order_value: totalOrderValue,

						raw_order: order,
						raw_item: item,
					})
				})
			})

			return {
				rows: flattenedRows,
				total: ordersData.total,
				page: ordersData.page,
				page_size: ordersData.page_size,
				total_pages: ordersData.total_pages,
				total_rows: flattenedRows.length,
			}
		},
	})

	const refreshOrders = async () => {
		await queryClient.invalidateQueries({ queryKey: ["orders"] })
	}

	const getRowsByOrderId = (orderId: string) =>
		query.data?.rows.filter((row) => row.order_id === orderId) || []

	const getUniqueOrders = () => {
		if (!query.data?.rows) return []
		const uniqueOrdersMap = new Map<string, OrderItemRow>()
		query.data.rows.forEach((row) => {
			if (!uniqueOrdersMap.has(row.order_id)) {
				uniqueOrdersMap.set(row.order_id, row)
			}
		})
		return Array.from(uniqueOrdersMap.values())
	}

	const getRowsByStatus = (status: Order["status"]) =>
		query.data?.rows.filter((row) => row.status === status) || []

	const getRowsByType = (type: Order["order_type"]) =>
		query.data?.rows.filter((row) => row.order_type === type) || []

	const getRowsByProduct = (productId: string) =>
		query.data?.rows.filter((row) => row.product_id === productId) || []

	const getRowsByClient = (clientId: string) =>
		query.data?.rows.filter((row) => row.client_id === clientId) || []

	const getTotalValue = () =>
		query.data?.rows.reduce((sum, row) => sum + row.item_total_value, 0) || 0

	const getTotalQuantityByProduct = (productId: string) =>
		query.data?.rows
			.filter((row) => row.product_id === productId)
			.reduce((sum, row) => sum + row.quantity, 0) || 0

	const getSummary = () => {
		if (!query.data?.rows) {
			return {
				totalOrders: 0,
				totalItems: 0,
				totalValue: 0,
				pendingOrders: 0,
				processedOrders: 0,
				canceledOrders: 0,
			}
		}

		const uniqueOrders = getUniqueOrders()

		return {
			totalOrders: uniqueOrders.length,
			totalItems: query.data.rows.length,
			totalValue: getTotalValue(),
			pendingOrders: uniqueOrders.filter((r) => r.status === "PENDENTE").length,
			processedOrders: uniqueOrders.filter((r) => r.status === "PROCESSADO")
				.length,
			canceledOrders: uniqueOrders.filter((r) => r.status === "CANCELADO")
				.length,
		}
	}

	return {
		...query,
		rows: query.data?.rows || [],
		pagination: {
			total: query.data?.total || 0,
			page: query.data?.page || 1,
			pageSize: query.data?.page_size || 20,
			totalPages: query.data?.total_pages || 0,
			totalRows: query.data?.total_rows || 0,
		},
		refreshOrders,
		getRowsByOrderId,
		getUniqueOrders,
		getRowsByStatus,
		getRowsByType,
		getRowsByProduct,
		getRowsByClient,
		getTotalValue,
		getTotalQuantityByProduct,
		getSummary,
	}
}

function getStatusLabel(status: Order["status"]): string {
	const labels = {
		PENDENTE: "Pendente",
		PROCESSADO: "Processado",
		CANCELADO: "Cancelado",
	}
	return labels[status] || status
}
