const statusDeliveryConfig = [
	{ label: "Pendente", status: "pending", color: "bg-yellow-400" },
	{ label: "Em trânsito", status: "in_transit", color: "bg-blue-500" },
	{ label: "Retornando", status: "return", color: " bg-purple-600" },
	{ label: "Cancelado", status: "canceled", color: "bg-red-500" },
	{ label: "Concluído", status: "concluded", color: "bg-green-500" },
]

export function DeliveryStatusLegend() {
	return (
		<div className="flex items-center gap-4">
			{statusDeliveryConfig.map(({ label, status, color }) => (
				<div key={status} className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full ${color}`} />
					<span className="text-sm text-muted-foreground">{label}</span>
				</div>
			))}
		</div>
	)
}
