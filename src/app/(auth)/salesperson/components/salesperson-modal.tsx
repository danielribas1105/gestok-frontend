"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Salesperson } from "@/schemas/Salesperson"
import SalespersonForm from "./salesperson-form"

interface SalespersonModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	salesperson?: Salesperson
}

export default function SalespersonModal({
	open,
	onOpenChange,
	salesperson,
}: SalespersonModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="50vw"
			maxHeight="90vh"
			title={
				salesperson ? "Editar vendedor/gerente" : "Adicionar vendedor/gerente"
			}
			description={
				salesperson
					? "Edite as informações do vendedor/gerente e clique em salvar"
					: "Preencha as informações para o novo vendedor/gerente e clique em salvar"
			}
		>
			<SalespersonForm
				salesperson={salesperson}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
