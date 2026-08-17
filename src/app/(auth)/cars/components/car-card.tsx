import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { converterDataParaBR, formatDate } from "@/utils/format-date"
import { Car } from "@/schemas/Car"
import LabelCard from "@/components/ui/label-card"
import CarModal from "./car-modal"
import { CAPACITY_LABELS } from "@/constants/Cars"

export interface CarCardProps {
	car: Car
}

export default function CarCard({ car }: CarCardProps) {
	const [open, setOpen] = useState(false)
	console.log("car", car)
	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do veículo ${car.model}`}
			>
				<header className="flex gap-2 items-start h-16">
					<div className="relative w-full h-20 flex-1/3 justify-center overflow-hidden border-2 rounded-md">
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
						<LabelCard
							description="Nome do motorista"
							label="Motorista"
							value={car.driver?.name ?? "Sem motorista"}
						/>
					</div>
				</header>
				<div className="flex flex-col gap-1 mt-4 text-secondary-foreground">
					<div className="flex gap-6">
						<LabelCard
							description="Número da CNH"
							label="CNH"
							value={car.driver?.license ?? "Sem motorista"}
						/>
						<LabelCard
							description="Categoria da CNH"
							label="Categoria"
							value={car.driver?.type ?? "-"}
						/>
					</div>
					<div className="flex gap-6">
						<LabelCard
							description="Validade da CNH"
							label="Validade CNH"
							value={formatDate(car.driver?.validity ?? "-")}
						/>
						<LabelCard
							description="Ano de fabricação do veículo"
							label="Fabricação"
							value={car.manufacture ?? 0}
						/>
					</div>
					<div className="flex gap-6">
						<LabelCard
							description="Kilometragem do veículo"
							label="Km"
							value={car.km ?? 0}
						/>
						<LabelCard
							description="Tipo de combustível"
							label="Combustível"
							value={car.fuel}
						/>
					</div>
					<div className="flex gap-2 text-muted-foreground">
						Capacidade carga:
						{car?.capacities.map((c) => (
							<div key={c.id} className="flex gap-2">
								<span className="flex gap-0.5">
									<p>{c.value}</p>
									<p>{CAPACITY_LABELS[c.unit]}</p>
								</span>
								<span>/</span>
							</div>
						))}
					</div>
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
