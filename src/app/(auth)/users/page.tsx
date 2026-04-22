"use client"
import TitlePage from "@/components/layout/title-page"

import ListUsers from "./components/list-users"
import { useState } from "react"
import UserModal from "./components/user-modal"

export default function UsersPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Usuários"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar usuário"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListUsers />
			</div>
			<UserModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
