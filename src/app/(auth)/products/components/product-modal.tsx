"use client"
import ModalWrapper from "@/components/layout/modal-wrapper"
import { Material } from "@/schemas/material"
import ProductForm from "./product-form"

interface ProductModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	product?: Material
}

export default function ProductModal({
	open,
	onOpenChange,
	product,
}: ProductModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={product ? "Excluir/Editar material" : "Adicionar material"}
			description={
				product
					? "Exclua ou edite as informações do material"
					: "Preencha as informações do novo material e clique em salvar"
			}
		>
			<ProductForm product={product} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
