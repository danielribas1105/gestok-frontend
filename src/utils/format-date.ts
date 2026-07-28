export function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

export function formatDataInput(raw: string) {
	const digits = raw.replace(/\D/g, "").slice(0, 6) // dd mm aa -> 6 dígitos
	if (digits.length > 4) {
		return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 6)}`
	}
	if (digits.length > 2) {
		return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
	}
	return digits
}

export function parseDataStringToISO(value: string): string | null {
	// espera "dd/mm/aa"
	const match = value.match(/^(\d{2})\/(\d{2})\/(\d{2})$/)
	if (!match) return null

	const [, day, month, year] = match
	// assume século 20xx — ajuste aqui se precisar de regra diferente (ex: pivot em 30)
	const fullYear = `20${year}`

	return `${fullYear}-${month}-${day}` // yyyy-mm-dd
}

// dd/mm/aa a partir de uma Date real (para preencher o form em modo edição)
export function formatDateToMask(value?: Date | string | null): string {
	if (!value) return ""

	const date = value instanceof Date ? value : new Date(value)

	if (isNaN(date.getTime())) return ""

	const d = String(date.getDate()).padStart(2, "0")
	const m = String(date.getMonth() + 1).padStart(2, "0")
	const y = String(date.getFullYear()).slice(-2)
	return `${d}/${m}/${y}`
}
