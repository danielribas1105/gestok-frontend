"use client"

import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import CarModal from "./components/car-modal"
import ListCars from "./components/list-cars"

export default function CarsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Veículos"
				placeholder="Procure pela placa - Ex: oxk8978"
				textTooltip="Adicionar veículo"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListCars />
			</div>
			<CarModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
