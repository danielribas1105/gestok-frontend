"use client"
import ModalWrapper from "@/components/layout/modal-wrapper"
import ProductForm from "./product-form"
import { Product } from "@/schemas/Product"

interface ProductModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	product?: Product
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
			width="50vw"
			maxHeight="90vh"
			title={product ? "Excluir/Editar produto" : "Adicionar produto"}
			description={
				product
					? "Exclua ou edite as informações do produto"
					: "Preencha as informações do novo produto e clique em salvar"
			}
		>
			<ProductForm
				product={product}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
