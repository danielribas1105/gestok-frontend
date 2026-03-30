"use client"

import { useActionState, useState } from "react"

import { login } from "@/lib/auth"

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
				<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
					{state.error}
				</div>
			)}

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700 mb-1.5"
				>
					E-mail
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
					placeholder="voce@exemplo.com"
					disabled={pending}
				/>
			</div>

			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700 mb-1.5"
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
						className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm
                       text-gray-900 placeholder-gray-400 shadow-sm pr-10
                       focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                       disabled:opacity-50"
						placeholder="••••••••"
						disabled={pending}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
						tabIndex={-1}
					>
						{showPassword ? (
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								/>
							</svg>
						) : (
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			<button
				type="submit"
				disabled={pending}
				className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white
                   shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
                   transition-colors duration-150"
			>
				{pending ? (
					<span className="flex items-center justify-center gap-2">
						<svg
							className="animate-spin h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Entrando…
					</span>
				) : (
					"Entrar"
				)}
			</button>
		</form>
	)
}
