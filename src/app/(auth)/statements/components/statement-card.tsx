import { Statement } from "@/schemas/statement"
import { useState } from "react"
import StatementModal from "./statement-modal"

const STATUS_COLORS: Record<Statement["status"], string> = {
	pending: "#F59E0B",
	approved: "#22C55E",
	rejected: "#EF4444",
	in_progress: "#3B82F6",
	concluded: "#8B5CF6",
}

const STATUS_LABELS: Record<Statement["status"], string> = {
	pending: "Pendente",
	approved: "Aprovado",
	rejected: "Rejeitado",
	in_progress: "Em andamento",
	concluded: "Concluído",
}

export interface StatementCardProps {
	statement: Statement
}

export default function StatementCard({ statement }: StatementCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-3 flex flex-col gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do manifesto ${statement.code}`}
			>
				<header>
					<h2 className="font-semibold text-sm truncate">
						Manifesto nº {statement.code}
					</h2>
				</header>

				<dl className="flex flex-col gap-1 text-sm text-muted-foreground flex-1">
					<div>
						<dt className="text-xs uppercase font-medium">M³</dt>
						<dd>{statement.m3}</dd>
					</div>
					<div>
						<dt className="text-xs uppercase font-medium">Criado</dt>
						<dd>
							{statement.created_at
								? new Date(statement.created_at).toLocaleDateString("pt-BR")
								: "—"}
						</dd>
					</div>
				</dl>

				<footer className="flex items-center gap-2">
					<span
						className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
						style={{ backgroundColor: STATUS_COLORS[statement.status] }}
						aria-hidden="true"
					/>
					<span className="text-xs uppercase font-medium">
						{STATUS_LABELS[statement.status]}
					</span>
				</footer>
			</article>

			<StatementModal
				open={open}
				onOpenChange={setOpen}
				statement={statement}
			/>
		</>
	)
}
