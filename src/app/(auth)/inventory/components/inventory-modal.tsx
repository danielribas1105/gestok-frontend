"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import InventoryForm, { StockMovementPayload } from "./inventory-form"
import { useProducts } from "@/hooks/products/use-products"
import { Inventory } from "@/schemas/Inventory"
import InventoryProductForm from "./inventory-product"

interface InventoryModalProps {
	open: boolean
	inventoryProduct?: Inventory
	onOpenChange: (v: boolean) => void
}

export default function InventoryModal({
	open,
	inventoryProduct,
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
			width={`${inventoryProduct ? "40vw" : "60vw"}`}
			maxHeight="90vh"
			title={"Adicionar produtos"}
			description={`${
				inventoryProduct
					? "Escolha o tipo de movimentação, insira a quantidade e clique em atualizar estoque"
					: "Selecione o produto, insira a quantidade e clique em adicionar"
			}
			`}
		>
			{inventoryProduct ? (
				<InventoryProductForm
					product={inventoryProduct}
					onSuccess={() => onOpenChange(false)}
					onCancel={() => onOpenChange(false)}
				/>
			) : (
				<InventoryForm
					products={products ?? []}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
				/>
			)}
		</ModalWrapper>
	)
}
