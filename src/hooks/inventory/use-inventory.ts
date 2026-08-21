"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { queryKeys } from "@/lib/query-keys"
import { Inventory } from "@/schemas/Inventory"
import { useQuery } from "@tanstack/react-query"

export function useInventory() {
	return useQuery<Inventory[]>({
		queryKey: queryKeys.inventory,
		queryFn: () => clientApi(routes.inventory.list),
	})
}
