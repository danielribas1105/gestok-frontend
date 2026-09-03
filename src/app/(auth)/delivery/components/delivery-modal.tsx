"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { DeliveryReadPayload, DeliveryStatus } from "@/types/Delivery"
import DeliveryForm from "./delivery-form"

interface DeliveryModalProps {
	open: boolean
	delivery?: DeliveryReadPayload
	onOpenChange: (v: boolean) => void
}

export default function DeliveryModal({
	open,
	delivery,
	onOpenChange,
}: DeliveryModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width={"60vw"}
			maxHeight="90vh"
			title={"Cadastrar NF"}
			description={"Cadastre a NF e atualize o status da entrega"}
		>
			<DeliveryForm
				delivery={delivery}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}
