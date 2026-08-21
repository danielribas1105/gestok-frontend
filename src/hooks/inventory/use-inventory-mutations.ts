import { StockMovementPayload } from "@/app/(auth)/inventory/components/inventory-form"
import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { queryKeys } from "@/lib/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useInventoryMutations() {
	const queryClient = useQueryClient()

	const createInventoryBatch = useMutation({
		mutationFn: (inventory: StockMovementPayload[]) =>
			clientApi(routes.inventory.updateBatch, {
				method: "POST",
				body: JSON.stringify({ inventory }),
			}),
		onSuccess: async () => {
			// estoque mudou → stock_status/stock_item_status dos pedidos
			// (calculados no back a partir de Inventory.available_quantity)
			// dependem disso. Sem essa invalidação cruzada, a tabela de
			// pedidos só reflete o novo saldo depois de um reload manual.
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.inventory }),
				queryClient.invalidateQueries({ queryKey: queryKeys.ordersRaw }),
			])
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
