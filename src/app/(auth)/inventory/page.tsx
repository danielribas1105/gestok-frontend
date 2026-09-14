"use client"
import TitlePage from "@/components/layout/title-page"
import { DataTable } from "@/components/ui/data-table"
import { useInventory } from "@/hooks/inventory/use-inventory"
import { useState } from "react"
import { InventoryColumns } from "./components/inventory-columns"
import { Inventory } from "@/schemas/Inventory"
import InventoryModal from "./components/inventory-modal"
import { Skeleton } from "@/components/ui/skeleton"

export default function InventoryPage() {
	const { data: inventory, isLoading } = useInventory()
	const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<
		Inventory | undefined
	>(undefined)

	if (isLoading) {
		return (
			<section>
				<div className="flex flex-col gap-1 items-center pt-16">
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
				</div>
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Estoque"
				placeholder="Busca"
				textTooltip="Adicionar Produto"
			/>
			<div className="flex justify-center">
				<DataTable
					columns={InventoryColumns}
					data={inventory ?? []}
					onRowClick={(product) => setSelectedInventoryProduct(product)}
				/>
			</div>
			<InventoryModal
				open={!!selectedInventoryProduct}
				onOpenChange={(v) => {
					if (!v) setSelectedInventoryProduct(undefined)
				}}
				inventoryProduct={selectedInventoryProduct}
			/>
		</section>
	)
}
