"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Driver } from "@/schemas/Driver"
import { useQuery } from "@tanstack/react-query"

export function useDrivers() {
	return useQuery<Driver[]>({
		queryKey: ["drivers"],
		queryFn: () => clientApi(routes.drivers.list),
	})
}

export function useDriver(id: string) {
	return useQuery<Driver>({
		queryKey: ["drivers", id],
		queryFn: () => clientApi(routes.drivers.getById(id)),
		enabled: !!id,
	})
}
