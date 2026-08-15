/**
 * Calcula o peso por caixa de um produto a partir do código do produto.
 *
 * Formato esperado: CAMPO_CAMPO_..._<quantidade>X<pesoUnitario><unidade>
 * Ex.: "BISCOITO_MAIZENA_RANCHEIRO_20X300G" -> 20 unidades x 300g
 *
 * Exceções conhecidas:
 * 1) Trecho incompleto tipo "6X" (sem peso unitário e sem unidade):
 *    assume-se peso unitário fixo de 560G.
 * 2) Trecho incompleto tipo "250G" (sem quantidade e sem "X"):
 *    assume-se quantidade fixa de 1.
 *
 * O peso final é acrescido de 10% para compensar a embalagem.
 *
 * @param productCode Código/nome do produto (ex.: "BISCOITO_MAIZENA_RANCHEIRO_20X300G")
 * @param packagingFactor Fator de acréscimo pela embalagem (padrão 10% = 0.10)
 * @param throwOnError Se true (padrão), lança erro em caso de falha no parse.
 *                      Se false, retorna 0 silenciosamente (sem lançar erro
 *                      e sem gerar mensagem/log no front).
 * @returns Peso total por caixa, em gramas (ou 0, se throwOnError=false e houver falha)
 */
export function calcularPesoPorCaixa(
	productCode: string,
	packagingFactor: number = 0.1,
	throwOnError: boolean = true,
): number {
	try {
		if (!productCode) {
			throw new Error("Código do produto inválido ou vazio.")
		}

		// Pega o último trecho após o "_", ex.: "20X300G"
		const partes = productCode.split("_")
		const ultimoTrecho = partes[partes.length - 1]

		let quantity: number
		let unitWeightInKilograms: number

		// --- Exceção 1: trecho incompleto tipo "6X" (sem peso/unidade) ---
		const matchSemPeso = ultimoTrecho.match(/^(\d+)X$/i)

		// --- Exceção 2: trecho incompleto tipo "250G" (sem quantidade/"X") ---
		const matchSemQuantidade = ultimoTrecho.match(/^(\d+(?:[.,]\d+)?)(KG|G)$/i)

		if (matchSemPeso) {
			const PESO_UNITARIO_EXCECAO_KILOGRAMAS = 0.56
			quantity = parseInt(matchSemPeso[1], 10)
			unitWeightInKilograms = PESO_UNITARIO_EXCECAO_KILOGRAMAS
		} else if (matchSemQuantidade) {
			const QUANTIDADE_EXCECAO = 1
			const rawUnitWeight = parseFloat(matchSemQuantidade[1].replace(",", "."))
			const unit = matchSemQuantidade[2].toUpperCase()

			quantity = QUANTIDADE_EXCECAO
			unitWeightInKilograms =
				unit === "G" ? rawUnitWeight / 1000 : rawUnitWeight
		} else {
			// --- Caso padrão: "<quantidade>X<peso><unidade>" ---
			const match = ultimoTrecho.match(/^(\d+)X(\d+(?:[.,]\d+)?)(KG|G)$/i)

			if (!match) {
				throw new Error(
					`Não foi possível extrair a quantidade/peso do trecho: "${ultimoTrecho}" (código completo: "${productCode}")`,
				)
			}

			quantity = parseInt(match[1], 10)
			const rawUnitWeight = parseFloat(match[2].replace(",", "."))
			const unit = match[3].toUpperCase()

			unitWeightInKilograms =
				unit === "G" ? rawUnitWeight / 1000 : rawUnitWeight
		}

		const baseWeight = quantity * unitWeightInKilograms
		return baseWeight * (1 + packagingFactor)
	} catch (error) {
		if (throwOnError) {
			throw error
		}
		return 0
	}
}

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
