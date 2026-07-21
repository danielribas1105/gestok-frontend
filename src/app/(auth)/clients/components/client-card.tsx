import { formatDate } from "@/utils/format-date"
import { useState } from "react"
import LabelCard from "@/components/ui/label-card"
import { Client } from "@/schemas/Client"
import ClientModal from "./client-modal"

export interface ClientCardProps {
	client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do cliente ${client.name}`}
			>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<header className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<h2 className="text-2xl font-semibold">{client.name}</h2>
						</div>
					</header>
					<div className="flex flex-col gap-2">
						<LabelCard
							description="Código do cliente"
							label="Código"
							value={client.code}
						/>
						<LabelCard
							description="Endereço do cliente"
							label="Endereço"
							value={client.address ?? ""}
						/>
					</div>
				</div>
				<footer className="flex items-center gap-1 text-secondary-foreground">
					<LabelCard
						description="Data de cadastro da transportadora"
						label="Data de Cadastro"
						value={formatDate(client.created_at ?? "")}
					/>
				</footer>
			</article>
			<ClientModal open={open} onOpenChange={setOpen} client={client} />
		</>
	)
}
