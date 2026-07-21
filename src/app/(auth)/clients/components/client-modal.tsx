"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Client } from "@/schemas/Client"
import ClientForm from "./client-form"

interface ClientModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	client?: Client
}

export default function ClientModal({
	open,
	onOpenChange,
	client,
}: ClientModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="60vw"
			maxHeight="90vh"
			title={client ? "Editar cliente" : "Adicionar cliente"}
			description={
				client
					? "Edite as informações do cliente e clique em salvar"
					: "Preencha as informações para o novo cliente e clique em salvar"
			}
		>
			<ClientForm
				client={client}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
