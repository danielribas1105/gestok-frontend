"use client"

import { useEffect, useRef } from "react"

export function useFleetSocket(onMessage: (data: any) => void) {
	const wsRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		const getToken = () =>
			document.cookie
				.split("; ")
				.find((c) => c.startsWith("access_token="))
				?.split("=")[1]

		let ws: WebSocket

		function connect() {
			const token = getToken()
			if (!token) return

			ws = new WebSocket(`ws://localhost:8000/ws/fleet?token=${token}`)

			ws.onmessage = (event) => {
				onMessage(JSON.parse(event.data))
			}

			ws.onclose = () => {
				// 🔥 reconecta automaticamente
				setTimeout(connect, 3000)
			}
		}

		connect()

		return () => ws?.close()
	}, [onMessage])
}
