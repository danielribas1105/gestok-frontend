"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { authApi } from "./api"

const ACCESS_COOKIE = "access_token"
const REFRESH_COOKIE = "refresh_token"
//const COOKIE_NAME = "auth_token"

export async function login(
	_prevState: { error?: string } | undefined,
	formData: FormData,
) {
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	try {
		const tokens = await authApi.login({ email, password })
		const cookieStore = await cookies()

		cookieStore.set(ACCESS_COOKIE, tokens.access_token, {
			httpOnly: true,
			path: "/",
		})

		cookieStore.set(REFRESH_COOKIE, tokens.refresh_token, {
			httpOnly: true,
			path: "/",
		})
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Credenciais inválidas"
		return { error: message }
	}

	redirect("/home")
}

export async function refreshAccessToken() {
	const cookieStore = await cookies()
	const refresh_token = cookieStore.get(REFRESH_COOKIE)?.value

	if (!refresh_token) return undefined

	try {
		const tokens = await authApi.refresh({
			refresh_token, // ✅ TS já entende como string aqui
		})

		cookieStore.set(ACCESS_COOKIE, tokens.access_token, {
			httpOnly: true,
			path: "/",
		})

		return tokens.access_token
	} catch {
		return undefined
	}
}

export async function logout() {
	const cookieStore = await cookies()
	cookieStore.delete(ACCESS_COOKIE)
	cookieStore.delete(REFRESH_COOKIE)
	redirect("/login")
}

export async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get("access_token")?.value

	if (!token) return null

	return { token }
}
