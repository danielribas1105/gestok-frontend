"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { authApi } from "./api"

const COOKIE_NAME = "auth_token"

export async function login(
	_prevState: { error?: string } | undefined,
	formData: FormData,
) {
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	try {
		const tokens = await authApi.login({ email, password })
		const cookieStore = await cookies()
		cookieStore.set(COOKIE_NAME, tokens.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: tokens.expire_at - Math.floor(Date.now() / 1000), // dinâmico
		})
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Login failed"
		return { error: message }
	}

	redirect("/home")
}

export async function logout() {
	const cookieStore = await cookies()
	cookieStore.delete(COOKIE_NAME)
	redirect("/login")
}

export async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get(COOKIE_NAME)?.value
	if (!token) return null

	try {
		const user = await authApi.me(token)
		return { user, token }
	} catch {
		return null
	}
}
