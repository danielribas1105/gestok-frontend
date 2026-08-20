"use client"
import TitlePage from "@/components/layout/title-page"
import { DataTable } from "@/components/ui/data-table"
import { useInventory } from "@/hooks/inventory/use-inventory"
import { useState } from "react"
import { InventoryColumns } from "./components/inventory-columns"

export default function InventoryPage() {
	const [open, setOpen] = useState(false)
	const { data: inventory, isLoading } = useInventory()

	console.log("inventory", inventory)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Estoque"
				placeholder="Busca"
				textTooltip="Adicionar Produto"
			/>
			<div className="flex justify-center">
				<DataTable columns={InventoryColumns} data={inventory ?? []} />
			</div>
			{/* <JobModal open={open} onOpenChange={setOpen} /> */}
		</section>
	)
}
