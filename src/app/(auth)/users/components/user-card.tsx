import Image from "next/image"

import avatar from "@/../public/img-user.png"
import { Badge } from "@/components/ui/badge"
import LabelCard from "@/components/ui/label-card"
import { User } from "@/schemas/User"
import { formatDate } from "@/utils/format-date"
import { useState } from "react"
import UserModal from "./user-modal"
import { USERS_STATUS_LABELS } from "@/constants/Users"

export interface UserCardProps {
	user: User
}

export default function UserCard({ user }: UserCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-56 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do usuário ${user.name}`}
			>
				<header className="flex gap-3 items-center">
					<div className="relative w-16 h-16 flex justify-center overflow-hidden">
						<Image
							src={user.image ?? avatar}
							alt={`Foto do usuário ${user.name}`}
							fill
							className="object-cover rounded-full"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl text-secondary-foreground font-semibold">
							{user.name}
						</h2>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</div>
				</header>
				<div className="flex flex-col gap-2">
					<LabelCard
						description="Número do CPF do usuário"
						label="CPF"
						value={user.cpf ?? ""}
					/>
					<LabelCard
						description="Perfil de usuário"
						label="Perfil"
						value={USERS_STATUS_LABELS[user.profile]}
					/>
				</div>
				<footer className="flex items-center gap-10">
					<LabelCard
						description="Data de cadastro do usuário"
						label="Cadastro"
						value={formatDate(user.created_at ?? "")}
					/>
					<Badge variant={user.active ? "default" : "destructive"}>
						{user.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</footer>
			</article>
			<UserModal open={open} onOpenChange={setOpen} user={user} />
		</>
	)
}
