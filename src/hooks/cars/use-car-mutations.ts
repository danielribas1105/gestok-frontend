"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clientApi } from "@/lib/api/client"
import { routes } from "@/config/routes"
import { toast } from "sonner"
import { Car } from "@/schemas/car"

export function useCarMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createCar = useMutation({
		mutationFn: (data: Partial<Car>) =>
			clientApi(routes.cars.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] })
			toast.success("Veículo criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar veículo")
		},
	})

	// UPDATE
	const updateCar = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Car> }) =>
			clientApi(routes.cars.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] })
			toast.success("Veículo atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Veículo não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteCar = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.cars.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] })
			toast.success("Veículo excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Veículo já foi removido")
				return
			}

			toast.error(error.message || "Erro ao excluir veículo")
		},
	})

	return {
		createCar,
		updateCar,
		deleteCar,
	}
}
