"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { queryKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export interface ProductQuantityCheck {
	product_id: string
	name: string
	name_code: string
	total_quantity: number
	available_quantity: number
	current_quantity: number
	reserved_quantity: number
	is_sufficient: boolean
	shortage: number
}

export interface ProductsQuantityCheckResponse {
	items: ProductQuantityCheck[]
	all_sufficient: boolean
}

/**
 * Compara, produto a produto, a quantidade pedida (soma dos pedidos
 * selecionados) com o estoque disponível. Cálculo feito no backend
 * via SUM + JOIN com `inventory`.
 */
export const useProductsQuantityCheck = (itemIds: string[]) => {
	return useQuery({
		queryKey: [...queryKeys.productsQuantityCheck, itemIds],
		queryFn: (): Promise<ProductsQuantityCheckResponse> =>
			clientApi(routes.orders.productsQuantityCheck, {
				method: "POST",
				body: JSON.stringify({ item_ids: itemIds }),
			}),
		enabled: itemIds.length > 0,
		staleTime: 30_000,
	})
}
