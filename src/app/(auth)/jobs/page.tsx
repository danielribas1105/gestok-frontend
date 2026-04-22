"use client"
import TitlePage from "@/components/layout/title-page"
import ListJobs from "./components/list-jobs"
import { useState } from "react"
import JobModal from "./components/job-modal"

export default function JobsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Transportes"
				placeholder="Procure pela placa - Ex: oxk8978"
				textTooltip="Adicionar Transporte"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListJobs />
			</div>
			<JobModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
