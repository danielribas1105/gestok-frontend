"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Work } from "@/schemas/work"
import { useQuery } from "@tanstack/react-query"

export function useWorks() {
	return useQuery<Work[]>({
		queryKey: ["works"],
		queryFn: () => clientApi(routes.works.list),
	})
}
