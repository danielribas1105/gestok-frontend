export function validatePhone(phone: string): boolean {
	const digits = phone.replace(/\D/g, "")

	// Aceita telefone fixo (10 dígitos: DDD + 8) ou celular (11 dígitos: DDD + 9)
	if (digits.length !== 10 && digits.length !== 11) {
		return false
	}

	// Rejeita sequências de dígitos repetidos (ex: 11111111111)
	if (/^(\d)\1+$/.test(digits)) {
		return false
	}

	const ddd = parseInt(digits.slice(0, 2))

	// DDDs válidos no Brasil vão de 11 a 99 (não existe DDD começando em 0)
	if (ddd < 11 || ddd > 99) {
		return false
	}

	// Se for celular (11 dígitos), o primeiro dígito do número deve ser 9
	if (digits.length === 11 && digits[2] !== "9") {
		return false
	}

	// Se for fixo (10 dígitos), o primeiro dígito do número deve ser de 2 a 5
	if (digits.length === 10 && !/^[2-5]/.test(digits[2])) {
		return false
	}

	return true
}

export function formatPhoneInput(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 11)

	if (digits.length <= 2) {
		return digits.length ? `(${digits}` : ""
	}
	if (digits.length <= 6) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
	}
	if (digits.length <= 10) {
		// fixo: (XX) XXXX-XXXX
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
	}
	// celular: (XX) XXXXX-XXXX
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
