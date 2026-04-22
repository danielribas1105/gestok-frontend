import { Info } from "lucide-react"
import Image from "next/image"

import avatar from "@/../public/img-user.png"
import { User } from "@/schemas/user"
import { useState } from "react"
import UserModal from "./user-modal"

export interface UserCardProps {
	user: User
}

export default function UserCard({ user }: UserCardProps) {
	const [open, setOpen] = useState(false)

	console.warn("UserCard", user) // Para verificar re-renderizações
	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do usuário ${user.name}`}
			>
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image
						src={user.image ?? avatar}
						alt={`Foto do usuário ${user.name}`}
						fill
						className="object-cover rounded-lg"
					/>
				</div>
				<header>
					<h2>{user.name}</h2>
				</header>
				<dl>
					<dt className="sr-only">Código</dt>
					<dd>Código: {user.id}</dd>
				</dl>
				<footer className="flex items-center gap-1">
					<Info
						size={16}
						color={user.active ? "#00FF00" : "#FF0000"}
						aria-hidden="true"
					/>
					<span className="text-sm uppercase">
						{user.active ? "Ativo" : "Inativo"}
					</span>
				</footer>
			</article>
			<UserModal open={open} onOpenChange={setOpen} user={user} />
		</>
	)
}
