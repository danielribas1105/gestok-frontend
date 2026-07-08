"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Product } from "@/schemas/Product"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useProductMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createProduct = useMutation({
		mutationFn: (data: Partial<Product>) =>
			clientApi(routes.products.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			toast.success("Produto criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar produto")
		},
	})

	// UPDATE
	const updateProduct = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
			clientApi(routes.products.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			toast.success("Produto atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Produto não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteProduct = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.products.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			toast.success("Produto excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Produto não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir produto")
		},
	})

	return {
		createProduct,
		updateProduct,
		deleteProduct,
	}
}
