"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job } from "@/schemas/job"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useJobMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createJob = useMutation({
		mutationFn: (data: Partial<Job>) =>
			clientApi(routes.jobs.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Trabalho criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar trabalho")
		},
	})

	// UPDATE
	const updateJob = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
			clientApi(routes.jobs.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Trabalho atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Trabalho não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteJob = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.jobs.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Trabalho excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Trabalho não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir trabalho")
		},
	})

	return {
		createJob,
		updateJob,
		deleteJob,
	}
}
