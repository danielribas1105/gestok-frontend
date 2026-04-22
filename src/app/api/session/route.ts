import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type JwtPayload = {
	sub: string
	email: string
	role: string
	exp: number
}

export async function GET() {
	const cookieStore = await cookies()

	let accessToken = cookieStore.get("access_token")?.value
	const refreshToken = cookieStore.get("refresh_token")?.value

	// ❌ Sem access token
	if (!accessToken) {
		return NextResponse.json({ user: null }, { status: 401 })
	}

	try {
		let decoded = jwtDecode<JwtPayload>(accessToken)

		// 🔥 Verifica expiração
		const isExpired = decoded.exp * 1000 < Date.now() + 5000 // 5s de margem

		// 🔄 TOKEN EXPIRADO → tenta refresh
		if (isExpired && refreshToken) {
			try {
				const res = await fetch(`${API_URL}/auth/refresh`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						refresh_token: refreshToken,
					}),
					cache: "no-store",
				})

				if (!res.ok) {
					throw new Error("Refresh failed")
				}

				const tokens = await res.json()

				// 🔥 salva novo access token
				cookieStore.set("access_token", tokens.access_token, {
					httpOnly: true,
					path: "/",
				})

				// 🔥 usa novo token
				accessToken = tokens.access_token
				decoded = jwtDecode<JwtPayload>(accessToken as string)
			} catch {
				// 🔥 limpa sessão inválida
				cookieStore.delete("access_token")
				cookieStore.delete("refresh_token")

				return NextResponse.json({ user: null }, { status: 401 })
			}
		}

		return NextResponse.json({
			user: {
				id: decoded.sub,
				email: decoded.email,
				role: decoded.role,
			},
		})
	} catch {
		// 🔥 fallback geral
		cookieStore.delete("access_token")
		cookieStore.delete("refresh_token")

		return NextResponse.json({ user: null }, { status: 401 })
	}
}
