export function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

// Converte data no formato 6/30/26 para 30/06/2026
export function converterDataParaBR(dataStr: string): Date {
	const [mes, dia, ano] = dataStr.split("/").map(Number)

	if (!mes || !dia || !ano) {
		throw new Error(`Data inválida: "${dataStr}"`)
	}

	// normaliza ano de 2 dígitos (26 -> 2026)
	const anoCompleto = ano < 100 ? 2000 + ano : ano

	const data = new Date(anoCompleto, mes - 1, dia)

	// valida se a data existe de fato (ex: 13/32/26 não vira uma data válida)
	if (
		data.getFullYear() !== anoCompleto ||
		data.getMonth() !== mes - 1 ||
		data.getDate() !== dia
	) {
		throw new Error(`Data inválida: "${dataStr}"`)
	}

	const diaBR = String(dia).padStart(2, "0")
	const mesBR = String(mes).padStart(2, "0")

	//return `${diaBR}/${mesBR}/${anoCompleto}`
	return data
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
