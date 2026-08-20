"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Inventory } from "@/schemas/Inventory"

import { useQuery } from "@tanstack/react-query"

export function useInventory() {
	return useQuery<Inventory[]>({
		queryKey: ["inventory"],
		queryFn: () => clientApi(routes.inventory.list),
	})
}
