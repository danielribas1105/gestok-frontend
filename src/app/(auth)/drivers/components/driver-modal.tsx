"use Driver"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Driver } from "@/schemas/Driver"
import DriverForm from "./driver-form"

interface DriverModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	driver?: Driver
}

export default function DriverModal({
	open,
	onOpenChange,
	driver,
}: DriverModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="60vw"
			maxHeight="90vh"
			title={driver ? "Editar Motorista" : "Adicionar Motorista"}
			description={
				driver
					? "Edite as informações do motorista e clique em salvar"
					: "Preencha as informações para o novo motorista e clique em salvar"
			}
		>
			<DriverForm
				driver={driver}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
