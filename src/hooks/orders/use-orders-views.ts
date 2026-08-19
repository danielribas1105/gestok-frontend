"use client"

import { OrderItemRow, OrdersFilters } from "@/types/Order"
import { useMemo } from "react"
import { useOrdersRaw } from "./use-orders-raw"

// Ajuste o path abaixo se o hook de clientes estiver em outro lugar no seu projeto
// TODO: saller_id/supervisor_id/manager_id apontam pra tabela `Salesperson`,
// NÃO pra `User` (são entidades diferentes no backend — ver model.py).
// useUsers() foi removido daqui porque resolvia o nome errado. Falta um
// hook tipo useSalespersons() quando existir o endpoint correspondente.

export interface OrderGroupRow {
	order_id: string
	cod_order: string
	operation_type: string
	order_date?: string
	status: string
	client_id: string
	client_name: string
	saller_id: string
	seller_name: string
	total_items: number
	total_value: number
	total_quantity: number
	observations?: string | null
	items: OrderItemRow[] // linhas originais desse pedido (para expandir)
}

export interface ProductGroupRow {
	product_id: string
	product_name_code: string
	product_name: string
	product_code: string
	product_unit: string
	product_weight: number
	product_volume: number
	product_boxes_pallet: number
	total_quantity: number
	total_value: number
	total_order_quantity: number
	order_count: number
	items: OrderItemRow[] // linhas originais desse produto (para expandir)
}

/**
 * Deriva as três visualizações pedidas — linha a linha (igual ao Excel),
 * agrupado por pedido e agrupado por produto — a partir de UMA ÚNICA
 * busca ao servidor (`useOrdersRaw`), enriquecida com os nomes de
 * cliente (`useClients`). Trocar de aba não dispara rede, só recalcula
 * em memória via useMemo.
 */
export const useOrdersViews = (filters: OrdersFilters = {}) => {
	const raw = useOrdersRaw(filters)
	const flatRows = raw.rows

	// View 2: agrupado por pedido
	const byOrder = useMemo<OrderGroupRow[]>(() => {
		const map = new Map<string, OrderGroupRow>()

		flatRows.forEach((row) => {
			if (!map.has(row.order_id)) {
				map.set(row.order_id, {
					order_id: row.order_id,
					cod_order: row.cod_order,
					operation_type: row.operation_type,
					order_date: row.order_date,
					status: row.status,
					client_id: row.client_id,
					client_name: row.client_name,
					saller_id: row.saller_id,
					seller_name: row.seller_name,
					total_items: row.total_order_items,
					total_value: row.total_order_value,
					total_quantity: row.total_order_quantity,
					observations: row.observations,
					items: [],
				})
			}
			map.get(row.order_id)!.items.push(row)
		})

		return Array.from(map.values()).sort((a, b) => {
			if (!a.order_date || !b.order_date) return 0
			return new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
		})
	}, [flatRows])

	// View 3: agrupado por produto
	const byProduct = useMemo<ProductGroupRow[]>(() => {
		const map = new Map<string, ProductGroupRow>()

		flatRows.forEach((row) => {
			if (!map.has(row.product_id)) {
				map.set(row.product_id, {
					product_id: row.product_id,
					product_name_code: row.product_name_code,
					product_name: row.product_name,
					product_code: row.product_code,
					product_unit: row.product_unit,
					product_weight: row.product_weight,
					product_volume: row.product_volume,
					product_boxes_pallet: row.product_boxes_pallet,
					total_quantity: 0,
					total_value: 0,
					total_order_quantity: 0,
					order_count: 0,
					items: [],
				})
			}
			const group = map.get(row.product_id)!
			group.total_quantity += row.quantity
			group.total_value += row.item_total_value
			group.items.push(row)
		})

		// order_count = número de pedidos distintos que contêm o produto
		map.forEach((group) => {
			group.order_count = new Set(group.items.map((i) => i.order_id)).size
		})

		return Array.from(map.values()).sort((a, b) =>
			a.product_name.localeCompare(b.product_name),
		)
	}, [flatRows])

	const summary = useMemo(() => {
		return {
			totalOrders: byOrder.length,
			totalItems: flatRows.length,
			totalProducts: byProduct.length,
			totalValue: flatRows.reduce((sum, r) => sum + r.item_total_value, 0),
			pendingOrders: byOrder.filter((o) => o.status === "pending").length,
			processedOrders: byOrder.filter((o) => o.status === "processed").length,
			canceledOrders: byOrder.filter((o) => o.status === "canceled").length,
			// campos extras que o schema real expõe e o Summary antigo não
			// tinha — disponíveis caso você queira novos cards
			blockedOrders: byOrder.filter((o) => o.status === "blocked").length,
			inTransitOrders: byOrder.filter((o) => o.status === "in_transit").length,
			concludedOrders: byOrder.filter((o) => o.status === "concluded").length,
		}
	}, [flatRows, byOrder])

	return {
		...raw,
		isLoading: raw.isLoading,
		flatRows,
		byOrder,
		byProduct,
		summary,
	}
}
