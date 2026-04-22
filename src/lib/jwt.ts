import { jwtDecode } from "jwt-decode"

export type JwtPayload = {
	sub: string
	email: string
	role: string
	exp: number
}

export function decodeJwt(token: string): JwtPayload | null {
	try {
		return jwtDecode<JwtPayload>(token)
	} catch {
		return null
	}
}
