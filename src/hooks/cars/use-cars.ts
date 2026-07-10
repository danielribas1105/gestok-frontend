"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Car } from "@/schemas/car"
import { useQuery } from "@tanstack/react-query"

export function useCars() {
	return useQuery<Car[]>({
		queryKey: ["cars"],
		queryFn: () => clientApi(routes.cars.list),
	})
}

export function useCar(id: string) {
	return useQuery<Car>({
		queryKey: ["cars", id],
		queryFn: () => clientApi(routes.cars.getById(id)),
		enabled: !!id,
	})
}
