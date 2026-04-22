import { ApiError } from "./api-error"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function clientApi(path: string, options: RequestInit = {}) {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		credentials: "include", // 🔥 ENVIA COOKIES
	})

	// 🔥 NÃO tentar parsear 204
	if (res.status === 204) {
		return null
	}

	if (!res.ok) {
		const data = await res.json().catch(() => null)

		throw new ApiError(data?.detail || "Erro na API", res.status, data)
	}

	return res.json()
}
