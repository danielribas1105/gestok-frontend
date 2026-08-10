import { formatDate } from "@/utils/format-date"
import { useState } from "react"
import { Salesperson } from "@/schemas/Salesperson"
import LabelCard from "@/components/ui/label-card"
import SalespersonModal from "./salesperson-modal"
import { Badge } from "@/components/ui/badge"

export interface SalespersonCardProps {
	salesperson: Salesperson
}

export default function SalespersonCard({ salesperson }: SalespersonCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do cliente ${salesperson.name}`}
			>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<header className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<h2 className="text-2xl font-semibold">{salesperson.name}</h2>
						</div>
					</header>
					<div className="flex flex-col gap-2">
						<LabelCard
							description="Código do cliente"
							label="Código"
							value={salesperson.code}
						/>
					</div>
				</div>
				<footer className="flex items-center gap-10">
					<LabelCard
						description="Data de cadastro do usuário"
						label="Cadastro"
						value={formatDate(salesperson.created_at ?? "")}
					/>
					<Badge variant={salesperson.active ? "default" : "destructive"}>
						{salesperson.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</footer>
			</article>
			<SalespersonModal
				open={open}
				onOpenChange={setOpen}
				salesperson={salesperson}
			/>
		</>
	)
}
