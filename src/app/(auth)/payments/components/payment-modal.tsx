"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Payment } from "@/schemas/payment"
import PaymentForm from "./payment-form"

interface PaymentModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	payment?: Payment
}

export default function PaymentModal({
	open,
	onOpenChange,
	payment,
}: PaymentModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={payment ? "Excluir/Editar pagamento" : "Adicionar pagamento"}
			description={
				payment
					? "Exclua ou edite as informações do pagamento"
					: "Preencha as informações do novo pagamento e clique em salvar"
			}
		>
			<PaymentForm payment={payment} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
