"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePaymentMutations } from "@/hooks/payments/use-payment-mutations"
import { Payment } from "@/schemas/payment"
import { useState } from "react"

interface PaymentFormProps {
	payment?: Payment
	onSuccess?: () => void
}

export default function PaymentForm({ payment, onSuccess }: PaymentFormProps) {
	const isEdit = !!payment

	const { createPayment, updatePayment, deletePayment } = usePaymentMutations()

	const [form, setForm] = useState({
		id: payment?.id || "",
		job_id: payment?.job_id || "",
		status: payment?.status || "pending",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updatePayment.mutateAsync({
					id: payment!.id,
					data: form,
				})
			} else {
				await createPayment.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!payment) return

		try {
			await deletePayment.mutateAsync(payment!.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createPayment.isPending ||
		updatePayment.isPending ||
		deletePayment.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="ID"
				value={form.id}
				onChange={(e) => setForm({ ...form, id: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="ID do Trabalho"
				value={form.job_id}
				onChange={(e) => setForm({ ...form, job_id: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Status"
				value={form.status}
				onChange={(e) => setForm({ ...form, status: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deletePayment.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o pagamento <strong>{payment?.id}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									Sim, excluir
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createPayment.isPending || updatePayment.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar"}
					</Button>
				</div>
			</div>
		</form>
	)
}
