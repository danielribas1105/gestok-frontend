"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Product } from "@/schemas/Product"

import { useQuery } from "@tanstack/react-query"

export function useProducts() {
	return useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: () => clientApi(routes.products.list),
	})
}
