"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Client } from "@/schemas/Client"
import { useQuery } from "@tanstack/react-query"

export function useClients() {
	return useQuery<Client[]>({
		queryKey: ["clients"],
		queryFn: () => clientApi(routes.clients.list),
	})
}

export function useClient(id: string) {
	return useQuery<Client>({
		queryKey: ["clients", id],
		queryFn: () => clientApi(routes.clients.getById(id)),
		enabled: !!id,
	})
}
