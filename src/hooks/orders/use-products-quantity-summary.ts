/**
 * Soma de quantidade por produto, calculada no backend (SUM + GROUP BY),
 * restrita aos pedidos selecionados. Usado pra checar se o estoque
 * cobre a entrega de vários pedidos de uma vez.
 */

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"

export interface ProductQuantitySummary {
	id: string // product_id do primeiro item encontrado com esse name_code
	name: string
	name_code: string
	total: number
}

export const useProductsQuantitySummary = (orderIds: string[]) => {
	return useQuery({
		queryKey: ["products-quantity-summary", orderIds],
		queryFn: (): Promise<ProductQuantitySummary[]> =>
			clientApi(routes.orders.productsQuantitySummary, {
				method: "POST",
				body: JSON.stringify({ order_ids: orderIds }),
			}),
		enabled: orderIds.length > 0,
		staleTime: 60_000,
	})
}
