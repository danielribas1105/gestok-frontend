"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import InventoryForm, { StockMovementPayload } from "./inventory-form"
import { useProducts } from "@/hooks/products/use-products"

interface InventoryModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
}

export default function InventoryModal({
	open,
	onOpenChange,
}: InventoryModalProps) {
	const { data: products, isLoading } = useProducts()

	async function handleSubmit(items: StockMovementPayload[]) {
		const response = await fetch("/api/stock-movements", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items }),
		})

		if (!response.ok) {
			throw new Error("Falha ao atualizar o estoque")
		}

		onOpenChange(false)
	}

	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="60vw"
			maxHeight="90vh"
			title={"Adicionar produtos"}
			description={
				"Selecione o produto, insira a quantidade e clique em adicionar"
			}
		>
			<InventoryForm
				products={products ?? []}
				onSubmit={handleSubmit}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}

/**
 * Exemplo de produtos extraídos da sua planilha (pedidostabelaander.xlsx),
 * apenas para referência de como o objeto InventoryProduct deve ser montado
 * a partir do backend (id real viria do banco):
 *
 * const products: InventoryProduct[] = [
 *   { id: crypto.randomUUID(), name: "BISCOITO MAIZENA RANCHEIRO 20X300G", unit: "CX" },
 *   { id: crypto.randomUUID(), name: "CAFE RANCHEIRO ALMOFADA 250G", unit: "KG" },
 *   { id: crypto.randomUUID(), name: "CAPPUCCINO TRADICIONAL PTE200G", unit: "CX" },
 *   { id: crypto.randomUUID(), name: "COOKIES CHOCOLATE RANCHEIRO 40X60G", unit: "CX" },
 * ]
 */
