"use client"

import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import ListPayments from "./components/list-payments"
import PaymentModal from "./components/payment-modal"

export default function PaymentsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Pagamentos"
				placeholder="Procure pelo placa ou motorista - Ex: oxk8978 ou João da Silva"
				textTooltip="Adicionar pagamento"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListPayments />
			</div>
			<PaymentModal open={open} onOpenChange={setOpen} />
		</section>
	)
}
