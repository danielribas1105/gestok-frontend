"use client"

import { useEffect, useState } from "react"

type User = {
	id: string
	email: string
	role: string
}

export function useSession() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchSession() {
			try {
				const res = await fetch("/api/session", {
					cache: "no-store",
				})

				if (!res.ok) {
					setUser(null)
					return
				}

				const data = await res.json()
				setUser(data.user)
			} catch {
				setUser(null)
			} finally {
				setLoading(false)
			}
		}

		fetchSession()
	}, [])

	console.log("Session:", { user, loading })
	return {
		user,
		isAuthenticated: !!user,
		loading,
	}
}
