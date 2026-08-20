import { StockMovementPayload } from "@/app/(auth)/inventory/components/inventory-form"
import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useInventoryMutations() {
	const queryClient = useQueryClient()

	// CREATE INVENTORY BATCH
	const createInventoryBatch = useMutation({
		mutationFn: (inventory: StockMovementPayload[]) =>
			clientApi(routes.inventory.updateBatch, {
				method: "POST",
				body: JSON.stringify({ inventory }),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] })
			toast.success("Inventário atualizado com sucesso 🎉")
		},
		onError: (error: any) => {
			toast.error(error.message || "Erro ao atualizar inventário")
		},
	})

	return {
		createInventoryBatch,
	}
}
