"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import ListClients from "./components/list-clients"
import ClientModal from "./components/client-modal"

export default function ClientsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Clientes"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar Cliente"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListClients />
			</div>
			<ClientModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
