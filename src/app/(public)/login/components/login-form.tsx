"use client"

import { useActionState, useState } from "react"

import { login } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff } from "lucide-react"

type State = { error?: string } | undefined

export default function LoginForm() {
	const [state, action, pending] = useActionState<State, FormData>(
		login,
		undefined,
	)
	const [showPassword, setShowPassword] = useState(false)

	return (
		<form action={action} className="space-y-5">
			{state?.error && (
				<div className="rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700">
					{state.error}
				</div>
			)}

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-zinc-700 mb-1.5"
				>
					E-mail
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className="block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
					placeholder="voce@exemplo.com"
					disabled={pending}
				/>
			</div>

			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-zinc-700 mb-1.5"
				>
					Senha
				</label>
				<div className="relative">
					<input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						required
						className="block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
						placeholder="••••••••"
						disabled={pending}
					/>
					<Button
						variant="ghost"
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute inset-y-1 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
						tabIndex={-1}
					>
						{showPassword ? <EyeOff /> : <Eye />}
					</Button>
				</div>
			</div>

			<Button
				variant="default"
				type="submit"
				disabled={pending}
				className="w-full rounded-lg bg-primary/90 px-4 py-5 text-sm font-semibold text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
			>
				{pending ? (
					<span className="flex items-center justify-center gap-2">
						<Spinner scale={1.2} />
						<p>Entrando…</p>
					</span>
				) : (
					<p>Entrar</p>
				)}
			</Button>
		</form>
	)
}
