"use client"

import { useTransition } from "react"

import { logout } from "@/lib/auth"

export default function LogoutButton() {
	const [pending, startTransition] = useTransition()

	return (
		<button
			onClick={() => startTransition(() => logout())}
			disabled={pending}
			className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{pending ? "Saindo…" : "Sair"}
		</button>
	)
}
