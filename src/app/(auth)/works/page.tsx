"use client"
import TitlePage from "@/components/layout/title-page"
import ListWorks from "./components/list-works"
import { useState } from "react"
import WorkModal from "./components/work-modal"

export default function WorksPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Obras"
				placeholder="Procure pelo nome da obra"
				textTooltip="Adicionar Obra"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListWorks />
			</div>
			<WorkModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
