import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/schemas/car"
import { useState } from "react"
import CarModal from "./car-modal"
import { formatDate } from "@/utils/format-date"
import LabelCard from "@/components/ui/label-card"

export interface CarCardProps {
	car: Car
}

export default function CarCard({ car }: CarCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do veículo ${car.model}`}
			>
				<header className="flex gap-2 items-start h-16">
					<div className="relative w-full h-16 flex-1/3 justify-center overflow-hidden border-2 rounded-md">
						<Image
							src={car.image ?? "/no-image.jpg"}
							alt={`Foto do veículo ${car.model}`}
							fill
							className="object-cover rounded-lg"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl text-secondary-foreground font-semibold">
							{car.model}
						</h2>
						<p className="text-lg text-muted-foreground font-semibold">
							{car.plate}
						</p>
					</div>
				</header>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<LabelCard
						description="Motorista"
						label="Motorista"
						value={car.driver.name ?? 0}
					/>
					<LabelCard
						description="Ano de fabricação"
						label="Ano"
						value={car.manufacture ?? 0}
					/>
					<LabelCard
						description="Tipo de combustível"
						label="Combustível"
						value={car.fuel}
					/>
				</div>
				<footer className="flex items-center justify-between gap-2">
					<LabelCard
						description="Data de cadastro do veículo"
						label="Desde"
						value={formatDate(car.created_at ?? "")}
					/>
					<Badge variant={car.active ? "default" : "destructive"}>
						{car.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</footer>
			</article>
			<CarModal open={open} onOpenChange={setOpen} car={car} />
		</>
	)
}
