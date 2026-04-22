"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Material } from "@/schemas/material"
import { useQuery } from "@tanstack/react-query"

export function useMaterials() {
	return useQuery<Material[]>({
		queryKey: ["materials"],
		queryFn: () => clientApi(routes.materials.list),
	})
}
