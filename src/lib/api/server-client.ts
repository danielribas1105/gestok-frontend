import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function serverApiClient(path: string, options: RequestInit = {}) {
	const cookieStore = await cookies()
	const token = cookieStore.get("access_token")?.value

	return fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
			...options.headers,
		},
	})
}
