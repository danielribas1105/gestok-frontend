"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Payment } from "@/schemas/payment"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function usePaymentMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createPayment = useMutation({
		mutationFn: (data: Partial<Payment>) =>
			clientApi(routes.payments.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payments"] })
			toast.success("Pagamento criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar pagamento")
		},
	})

	// UPDATE
	const updatePayment = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
			clientApi(routes.payments.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payments"] })
			toast.success("Pagamento atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Pagamento não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deletePayment = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.payments.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payments"] })
			toast.success("Pagamento excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Pagamento não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir pagamento")
		},
	})

	return {
		createPayment,
		updatePayment,
		deletePayment,
	}
}
