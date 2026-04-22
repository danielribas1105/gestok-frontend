import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/schemas/car"
import { useState } from "react"
import CarModal from "./car-modal"

export interface CarCardProps {
	car: Car
}

export default function CarCard({ car }: CarCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do veículo ${car.model}`}
			>
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image
						src={car.image ?? "/no-image.jpg"}
						alt={`Foto do veículo ${car.model}`}
						fill
						className="object-cover rounded-lg"
					/>
				</div>
				<header>
					<h2>{car.model}</h2>
				</header>
				<dl>
					<dt className="sr-only">Código</dt>
					<dd>Código: {car.id}</dd>
				</dl>
				<footer className="flex items-center gap-1">
					<Badge
						variant={car.active ? "default" : "destructive"}
						className="ml-auto"
					>
						{car.active ? "Ativo" : "Inativo"}
					</Badge>
				</footer>
			</article>
			<CarModal open={open} onOpenChange={setOpen} car={car} />
		</>
	)
}
