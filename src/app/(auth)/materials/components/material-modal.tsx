"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Material } from "@/schemas/material"
import MaterialForm from "./material-form"

interface MaterialModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	material?: Material
}

export default function MaterialModal({
	open,
	onOpenChange,
	material,
}: MaterialModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={material ? "Excluir/Editar material" : "Adicionar material"}
			description={
				material
					? "Exclua ou edite as informações do material"
					: "Preencha as informações do novo material e clique em salvar"
			}
		>
			<MaterialForm material={material} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
