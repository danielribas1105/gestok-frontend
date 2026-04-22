"use client"
import TitlePage from "@/components/layout/title-page"
import ListStatements from "./components/list-statements"
import { useState } from "react"
import StatementModal from "./components/statement-modal"

export default function StatementsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Manifestos"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar Manifesto"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListStatements />
			</div>
			<StatementModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
