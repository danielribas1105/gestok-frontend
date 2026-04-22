export function handleApiError(error: any): string {
	if (!error) return "Erro desconhecido"

	// 🔥 status HTTP
	switch (error.status) {
		case 400:
			return error.message || "Dados inválidos"
		case 401:
			return "Sessão expirada, faça login novamente"
		case 403:
			return "Você não tem permissão"
		case 404:
			return "Registro não encontrado"
		case 409:
			return "Conflito de dados"
		case 500:
			return "Erro interno do servidor"
		default:
			return error.message || "Erro inesperado"
	}
}
