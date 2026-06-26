export function parseValueM3(raw: string): number {
	// "1.234,56" → 1234.56  |  "10,50" → 10.50  |  "10.50" → 10.50
	const normalized = raw.trim().replace(/\./g, "").replace(",", ".")
	const parsed = parseFloat(normalized)
	return isNaN(parsed) ? 0 : parsed
}

export function formatCurrencyBR(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value)
}
