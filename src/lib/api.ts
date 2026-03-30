const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	email: string
	password: string
	full_name?: string
}

export interface TokenResponse {
	access_token: string
	refresh_token: string
	token_type: string
	expire_at: number // adicionado
}

export interface UserResponse {
	id: string
	name: string
	email: string
	emailVerified: boolean
	active: boolean
	image: string | null
	createdAt: string
}

async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		headers: { "Content-Type": "application/json", ...options.headers },
		...options,
	})

	if (!res.ok) {
		const error = await res.json().catch(() => ({ detail: "Unknown error" }))
		throw new Error(error.detail ?? "Request failed")
	}

	return res.json()
}

export const authApi = {
	login: (payload: LoginPayload) =>
		apiFetch<TokenResponse>("/auth/login", {
			method: "POST",
			body: JSON.stringify(payload),
		}),

	register: (payload: RegisterPayload) =>
		apiFetch<UserResponse>("/users/", {
			method: "POST",
			body: JSON.stringify(payload),
		}),

	me: (token: string) =>
		apiFetch<UserResponse>("/users/me", {
			headers: { Authorization: `Bearer ${token}` },
		}),
}
