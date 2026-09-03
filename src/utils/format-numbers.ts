export function formatCurrencyBR(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value)
}

function formatCurrency(value: number) {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function parseNumberBR(value: unknown): number {
	if (value === null || value === undefined || value === "") return NaN
	if (typeof value === "number") return value

	const str = String(value).trim()

	// Tem vírgula -> formato BR ("1.234,56"): pontos são milhar, vírgula é decimal
	if (str.includes(",")) {
		return Number(str.replace(/\./g, "").replace(",", "."))
	}

	// Sem vírgula -> assume ponto como decimal ("8.91", "0.763938", "1050")
	return Number(str)
}

export function parseValueM3(raw: string): number {
	const parsed = parseNumberBR(raw)
	return isNaN(parsed) ? 0 : parsed
}
