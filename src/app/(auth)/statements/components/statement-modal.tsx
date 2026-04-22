"use client"
import ModalWrapper from "@/components/layout/modal-wrapper"
import { Statement } from "@/schemas/statement"
import StatementForm from "./statement-form"

interface StatementModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	statement?: Statement
}

export default function StatementModal({
	open,
	onOpenChange,
	statement,
}: StatementModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={statement ? "Excluir/Editar manifesto" : "Adicionar manifesto"}
			description={
				statement
					? "Exclua ou edite as informações do manifesto"
					: "Preencha as informações do novo manifesto e clique em salvar"
			}
		>
			<StatementForm
				statement={statement}
				onSuccess={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
