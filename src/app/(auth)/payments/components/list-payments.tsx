import { usePayments } from "@/hooks/payments/use-payments"
import { Payment } from "@/schemas/payment"
import PaymentCard from "./payment-card"

export default function ListPayments() {
	const { data: payments = [], isLoading } = usePayments()

	if (isLoading) return <p>Carregando...</p>

	if (payments.length === 0) {
		return <div>Nenhum pagamento encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{payments &&
				payments.map((payment: Payment) => (
					<PaymentCard key={payment.id} payment={payment} />
				))}
		</div>
	)
}
