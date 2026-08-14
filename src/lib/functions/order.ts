export function getOperationTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		sale: "Venda",
		tasting: "Degustação",
		bonus: "Bonificação",
	}
	return labels[type] || type
}

export function getOrderStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		pending: "Pendente",
		processed: "Processado",
		blocked: "Bloqueado",
		in_transit: "Em Trânsito",
		canceled: "Cancelado",
		concluded: "Concluído",
	}
	return labels[status] || status
}
