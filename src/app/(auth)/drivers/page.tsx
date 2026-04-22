"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"

export default function DriversPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Motoristas"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar Motorista"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">{/* <ListJobs /> */}</div>
			{/* <JobModal open={open} onOpenChange={setOpen} /> */}
		</section>
	)
}
