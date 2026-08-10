export const REQUIRED_COLUMNS = [
	"pedido", // code
	"emissao_pedido", // created_at
	"tipo_de_operacao",
	"cod_cliente",
	"produto",
	"un_medida",
	"quantidade",
	"valor",
	"cliente",
	"cod_cliente", // client_id
	"rota", // saller_id
	"supervisor", // supervisor_id
	"gerente", // manager_id
] as const

// Normaliza o header
export function createHeaderKey(texto: string): string {
	return texto
		.normalize("NFD") // Separa os acentos
		.replace(/[\u0300-\u036f]/g, "") // Remove os acentos
		.toLowerCase() // Transforma em minúsculas
		.replace(/[^\w\s-]/g, " ") // Troca qualquer pontuação/símbolo por um espaço
		.trim() // Limpa espaços nas pontas
		.replace(/\s+/g, "_") // Troca múltiplos espaços por um único "_"
}

// mesma normalização que você já usa no transformHeader do CSV
export function normalizeHeader(header: string): string {
	const newHeader = createHeaderKey(header)
	return newHeader
}

// Verifica se todas as colunas exigidas pelo DB estão presentes na planilha enviada
export function validateFileHeaders(headers: string[]): string[] {
	const normalized = headers.map(normalizeHeader)
	console.log("normalized", normalized)
	return REQUIRED_COLUMNS.filter((required) => !normalized.includes(required))
}

export function normalizeText(value: unknown): string {
	return String(value ?? "")
		.trim()
		.toUpperCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // remove acentos
		.replace(/\s+/g, " ")
}

export function generateNameCode(description: string): string {
	let text = description.trim() // remove só espaços nas pontas (o padding do arquivo)
	text = text.toUpperCase()
	text = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // remove os acentos (equivalente ao encode/decode ASCII do Python)
	text = text.replace(/ /g, "_")
	return text
}
