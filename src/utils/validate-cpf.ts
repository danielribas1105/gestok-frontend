export default function validateCPF(cpf: string): boolean {
	const digits = cpf.replace(/\D/g, '');
	
	if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
		return false;
	}
	
	// Validação dos dígitos verificadores
	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(digits[i]) * (10 - i);
	}
	let firstDigit = (sum * 10) % 11;
	if (firstDigit === 10) firstDigit = 0;
	
	if (parseInt(digits[9]) !== firstDigit) return false;
	
	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(digits[i]) * (11 - i);
	}
	let secondDigit = (sum * 10) % 11;
	if (secondDigit === 10) secondDigit = 0;
	
	return parseInt(digits[10]) === secondDigit;
}