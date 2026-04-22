"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import ListProducts from "./components/list-products"
import ProductModal from "./components/product-modal"

export default function MaterialsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Materiais"
				placeholder="Procure pelo nome - Ex: brita"
				textTooltip="Adicionar material"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListProducts />
			</div>
			<ProductModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
