"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import SalespersonModal from "./components/salesperson-modal"
import ListSalesperson from "./components/list-salesperson"

export default function SalespersonPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Vendedores/Gerentes"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar venddor"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListSalesperson />
			</div>
			<SalespersonModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
