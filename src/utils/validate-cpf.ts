export function validateCPF(cpf: string): boolean {
	const digits = cpf.replace(/\D/g, "")

	if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
		return false
	}

	// Validação dos dígitos verificadores
	let sum = 0
	for (let i = 0; i < 9; i++) {
		sum += parseInt(digits[i]) * (10 - i)
	}
	let firstDigit = (sum * 10) % 11
	if (firstDigit === 10) firstDigit = 0

	if (parseInt(digits[9]) !== firstDigit) return false

	sum = 0
	for (let i = 0; i < 10; i++) {
		sum += parseInt(digits[i]) * (11 - i)
	}
	let secondDigit = (sum * 10) % 11
	if (secondDigit === 10) secondDigit = 0

	return parseInt(digits[10]) === secondDigit
}

export function formatCPFInput(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 11)

	if (digits.length <= 3) {
		return digits
	}
	if (digits.length <= 6) {
		return `${digits.slice(0, 3)}.${digits.slice(3)}`
	}
	if (digits.length <= 9) {
		return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
	}
	return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
