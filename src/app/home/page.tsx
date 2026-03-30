import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"

import LogoutButton from "./components/logout-button"

export default async function HomePage() {
	const session = await getSession()
	if (!session) redirect("/login")

	const { user } = session

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navbar */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
							<svg
								className="w-5 h-5 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<span className="font-semibold text-gray-900">
							Auth Boilerplate
						</span>
					</div>
					<LogoutButton />
				</div>
			</header>

			{/* Content */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
				{/* Welcome */}
				<div className="bg-indigo-600 rounded-2xl p-6 text-white">
					<p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-1">
						Bem-vindo de volta
					</p>
					<h1 className="text-2xl font-bold">{user.name ?? user.email}</h1>
				</div>

				{/* User info card */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
						Dados da conta
					</h2>
					<dl className="space-y-3">
						<InfoRow label="ID" value={user.id} mono />
						<InfoRow label="E-mail" value={user.email} />
						<InfoRow label="Nome" value={user.name ?? "—"} />
						<InfoRow label="Conta ativa" value={user.active ? "Sim" : "Não"} />
						<InfoRow
							label="Verificado"
							value={user.emailVerified ? "Sim" : "Não"}
						/>
						<InfoRow
							label="Criado em"
							value={new Date(user.createdAt).toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						/>
					</dl>
				</div>
			</main>
		</div>
	)
}

function InfoRow({
	label,
	value,
	mono,
}: {
	label: string
	value: string
	mono?: boolean
}) {
	return (
		<div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
			<dt className="text-sm text-gray-500 shrink-0">{label}</dt>
			<dd
				className={`text-sm text-gray-900 text-right break-all ${mono ? "font-mono" : ""}`}
			>
				{value}
			</dd>
		</div>
	)
}
