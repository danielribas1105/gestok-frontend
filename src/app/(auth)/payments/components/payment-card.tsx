import { Payment } from "@/schemas/payment"
import { useState } from "react"

export interface PaymentCardProps {
	payment: Payment
}

export default function PaymentCard({ payment }: PaymentCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do material ${payment.id}`}
			>
				<div className="flex flex-col gap-1">
					<header>
						<h2>Material {payment.job_id}</h2>
					</header>
					<p>Tipo: {payment.m3}</p>
					<p>Valor m3: {payment.value_m3}</p>
				</div>
			</article>
			{/* <JobModal open={open} onOpenChange={setOpen} job={job} /> */}
		</>
	)
}
