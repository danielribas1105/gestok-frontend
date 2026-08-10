"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Salesperson } from "@/schemas/Salesperson"
import { useQuery } from "@tanstack/react-query"

export function useSalespersons() {
	return useQuery<Salesperson[]>({
		queryKey: ["salesperson"],
		queryFn: () => clientApi(routes.salesperson.list),
	})
}

export function useSalesperson(id: string) {
	return useQuery<Salesperson>({
		queryKey: ["salesperson", id],
		queryFn: () => clientApi(routes.salesperson.getById(id)),
		enabled: !!id,
	})
}
