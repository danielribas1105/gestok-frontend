import { useMemo } from "react"
import { useProducts } from "../products/use-products"
import { useOrders } from "./use-orders"

// Estrutura pivotada: 1 pedido por linha, produtos como colunas
export interface PivotedOrderRow {
	// Dados fixos do pedido
	order_id: string
	cod_order: number
	order_type: "BONIFICACAO" | "DEGUSTACAO" | "VENDA"
	order_type_label: string
	order_date: string
	order_date_formatted: string
	status: "PENDENTE" | "PROCESSADO" | "CANCELADO"
	status_label: string

	// Dados do cliente
	client_id: string
	client_name: string
	client_code: string

	// Dados do usuário
	user_id: string
	user_name: string

	// Totais
	total_items: number
	total_value: number

	// Produtos (dinâmico) - key é o product_id, value é a quantidade
	products: Record<
		string,
		{
			quantity: number
			unit_value: number
			total_value: number
			product_name: string
			product_code: string
			product_unit: string
		}
	>

	// Observações
	observations?: string
}

export interface ProductColumn {
	id: string
	code: string
	name: string
	unit: string
}

export const useOrdersPivot = (
	page: number = 1,
	pageSize: number = 20,
	search?: string,
) => {
	const ordersQuery = useOrders(page, pageSize, search)
	const { data: products, isLoading } = useProducts()

	// Usar TODOS os produtos da tabela de produtos (fixo)
	const allProducts = useMemo(() => {
		if (!products || products.length === 0) return []

		// Mapear produtos da tabela para o formato ProductColumn
		return products
			.filter((p) => p.active) // Apenas produtos ativos
			.map((product) => ({
				id: product.id || "",
				code: product.code,
				name: product.description,
				unit: product.unit,
			}))
			.sort((a, b) => a.name.localeCompare(b.name))
	}, [products])

	// Pivotar dados: agrupar por pedido
	const pivotedData = useMemo(() => {
		if (!ordersQuery.data?.rows) return []

		const ordersMap = new Map<string, PivotedOrderRow>()

		ordersQuery.data.rows.forEach((row) => {
			if (!ordersMap.has(row.order_id)) {
				// Criar novo pedido
				ordersMap.set(row.order_id, {
					order_id: row.order_id,
					cod_order: Number(row.cod_order),
					order_type: row.order_type,
					order_type_label: row.order_type_label,
					order_date: row.order_date,
					order_date_formatted: row.order_date_formatted,
					status: row.status,
					status_label: row.status_label,
					client_id: row.client_id,
					client_name: row.client_name,
					client_code: row.client_code,
					user_id: row.user_id,
					user_name: row.user_name,
					total_items: row.total_order_items,
					total_value: row.total_order_value,
					products: {},
					observations: row.observations,
				})
			}

			// Adicionar produto ao pedido
			const order = ordersMap.get(row.order_id)!
			order.products[row.product_id] = {
				quantity: row.quantity,
				unit_value: row.unit_value,
				total_value: row.item_total_value,
				product_name: row.product_name,
				product_code: row.product_code,
				product_unit: row.product_unit,
			}
		})

		return Array.from(ordersMap.values())
	}, [ordersQuery.data?.rows])

	// Filtrar dados pivotados
	const filteredPivotedData = useMemo(() => {
		return pivotedData
	}, [pivotedData])

	return {
		...ordersQuery,
		pivotedData: filteredPivotedData,
		allProducts, // Agora contém TODOS os produtos da tabela
		totalOrders: pivotedData.length,
		isLoading, // Expõe loading dos produtos
	}
}
