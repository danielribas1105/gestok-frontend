"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import DriverModal from "./components/driver-modal"
import ListDrivers from "./components/list-drivers"

export default function Drivers() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Motoristas"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar Motorista"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListDrivers />
			</div>
			<DriverModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
