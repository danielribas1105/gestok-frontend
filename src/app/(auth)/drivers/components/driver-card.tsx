import Image from "next/image"
import avatar from "@/../public/img-user.png"
import LabelCard from "@/components/ui/label-card"
import { Driver } from "@/schemas/Driver"
import { formatDate } from "@/utils/format-date"
import { useState } from "react"
import DriverModal from "./driver-modal"
import { Badge } from "@/components/ui/badge"

export interface DriverCardProps {
	driver: Driver
}

export default function DriverCard({ driver }: DriverCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-56 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do usuário ${driver.name}`}
			>
				<header className="flex gap-3 items-center">
					<div className="relative w-16 h-16 flex justify-center overflow-hidden">
						<Image
							src={driver.image ?? avatar}
							alt={`Foto do usuário ${driver.name}`}
							fill
							className="object-cover rounded-full"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl text-secondary-foreground font-semibold">
							{driver.name}
						</h2>
						{/* <p className="text-sm text-muted-foreground">{driver.email}</p> */}
					</div>
				</header>
				<div className="flex flex-col gap-2">
					<LabelCard
						description="Número da CNH"
						label="CNH"
						value={driver.license ?? ""}
					/>
					<LabelCard
						description="Número do CPF"
						label="CPF"
						value={driver.cpf ?? ""}
					/>
				</div>
				<footer className="flex items-center gap-10">
					<LabelCard
						description="Data de cadastro do usuário"
						label="Cadastro"
						value={formatDate(driver.created_at ?? "")}
					/>
					<Badge variant={driver.active ? "default" : "destructive"}>
						{driver.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</footer>
			</article>
			<DriverModal open={open} onOpenChange={setOpen} driver={driver} />
		</>
	)
}
