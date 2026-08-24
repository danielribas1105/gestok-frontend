"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Delivery } from "@/schemas/Delivery"
import { DeliveryReadPayload } from "@/types/Delivery"
import { useQuery } from "@tanstack/react-query"

export function useDelivery() {
	return useQuery<DeliveryReadPayload[]>({
		queryKey: ["delivery"],
		queryFn: () => clientApi(routes.delivery.list),
	})
}

export function useCar(id: string) {
	return useQuery<Delivery>({
		queryKey: ["delivery", id],
		queryFn: () => clientApi(routes.delivery.getById(id)),
		enabled: !!id,
	})
}
