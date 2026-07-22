"use client"

import { useQuery } from "@tanstack/react-query"
import { clientApi } from "@/lib/api/client"
import { routes } from "@/config/routes"
import { User } from "@/schemas/User"

export function useUsers() {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => clientApi(routes.users.list),
	})
}

export function useUser(id: string) {
	return useQuery<User>({
		queryKey: ["users", id],
		queryFn: () => clientApi(routes.users.getById(id)),
		enabled: !!id,
	})
}

export function useDriverList() {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => clientApi(routes.users.getDriverList),
	})
}
