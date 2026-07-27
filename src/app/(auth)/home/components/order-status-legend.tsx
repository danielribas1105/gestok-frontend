const statusConfig = [
	{ label: "Concluído", status: "concluded", color: "bg-green-500" },
	{ label: "Em andamento", status: "in_progress", color: "bg-blue-500" },
	{ label: "Pendente", status: "pending", color: "bg-yellow-400" },
	{ label: "Cancelado", status: "canceled", color: "bg-red-500" },
]

export function OrderStatusLegend() {
	return (
		<div className="flex items-center gap-4">
			{statusConfig.map(({ label, status, color }) => (
				<div key={status} className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full ${color}`} />
					<span className="text-sm text-muted-foreground">{label}</span>
				</div>
			))}
		</div>
	)
}
