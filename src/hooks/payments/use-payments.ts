"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Payment } from "@/schemas/payment"
import { useQuery } from "@tanstack/react-query"

export function usePayments() {
	return useQuery<Payment[]>({
		queryKey: ["payments"],
		queryFn: () => clientApi(routes.payments.list),
	})
}
