"use client"

import { useQuery } from "@tanstack/react-query"
import { clientApi } from "@/lib/api/client"
import { routes } from "@/config/routes"
import { User } from "@/schemas/user"

export function useUsers() {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => clientApi(routes.users.list),
	})
}
