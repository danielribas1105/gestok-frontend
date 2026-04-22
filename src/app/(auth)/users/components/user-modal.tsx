"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { User } from "@/schemas/user"
import UserForm from "./user-form"

interface UserModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	user?: User
}

export default function UserModal({
	open,
	onOpenChange,
	user,
}: UserModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={user ? "Editar usuário" : "Adicionar usuário"}
			description={
				user
					? "Edite as informações do usuário e clique em salvar"
					: "Preencha as informações do novo usuário e clique em salvar"
			}
		>
			<UserForm user={user} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
