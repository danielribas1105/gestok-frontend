"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useDeliveryMutations } from "@/hooks/delivery/use-delivery-mutations"
import { DeliveryReadPayload, DeliveryStatus } from "@/types/Delivery"
import { useState } from "react"

interface DeliveryFormProps {
	delivery?: DeliveryReadPayload
	onSuccess?: () => void
	onCancel?: () => void
}

const STATUS_OPTIONS: { value: DeliveryStatus; label: string }[] = [
	{ value: "pending", label: "Pendente" },
	{ value: "in_transit", label: "Em trânsito" },
	{ value: "return", label: "Devolução" },
	{ value: "canceled", label: "Cancelada" },
	{ value: "concluded", label: "Concluída" },
]

function formatDate(date: Date | string | null | undefined) {
	if (!date) return "-"
	const d = new Date(date)
	if (Number.isNaN(d.getTime())) return "-"
	return d.toLocaleDateString("pt-BR")
}

export default function DeliveryForm({
	delivery,
	onSuccess,
	onCancel,
}: DeliveryFormProps) {
	const { updateDelivery } = useDeliveryMutations()
	const [invoice, setInvoice] = useState(delivery?.invoice ?? "")
	const [status, setStatus] = useState<DeliveryStatus>(
		delivery?.status ?? "pending",
	)
	const [loading, setLoading] = useState(false)

	if (!delivery) return null

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()
		if (!delivery) return

		setLoading(true)
		try {
			await updateDelivery.mutateAsync({
				id: delivery.id,
				data: { invoice, status },
			})
			onSuccess?.()
		} catch {
			// erro já tratado (toast) dentro do hook
		} finally {
			setLoading(false)
		}
	}

	function handleCancel() {
		setInvoice(delivery?.invoice ?? "")
		setStatus(delivery?.status ?? "pending")
		onCancel?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Dados da entrega — somente leitura */}
			<div className="grid grid-cols-4 gap-2">
				<div className="space-y-1">
					<Label>Código do Pedido</Label>
					<Input value={delivery.order_code} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Veículo</Label>
					<Input value={delivery.car} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Motorista</Label>
					<Input value={delivery.driver} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Peso (Kg)</Label>
					<Input value={delivery.weight} disabled readOnly />
				</div>
			</div>

			<div className="grid grid-cols-4 gap-2">
				<div className="space-y-1">
					<Label>Lançamento</Label>
					<Input value={formatDate(delivery.created_at)} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Agendamento</Label>
					<Input value={formatDate(delivery.scheduled_at)} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Data de saída</Label>
					<Input value={formatDate(delivery.departed_at)} disabled readOnly />
				</div>
				<div className="space-y-1">
					<Label>Data de entrega</Label>
					<Input value={formatDate(delivery.delivered_at)} disabled readOnly />
				</div>
			</div>

			<div className="space-y-1">
				<Label>Observações</Label>
				<Input value={delivery.observations || "-"} disabled readOnly />
			</div>

			{/* Campos editáveis */}
			<div className="grid grid-cols-2 gap-2">
				<div className="space-y-1">
					<Label htmlFor="invoice">Nota Fiscal (NF)</Label>
					<Input
						id="invoice"
						placeholder="Número da NF"
						value={invoice}
						onChange={(e) => setInvoice(e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="status">Status</Label>
					<Select
						value={status}
						onValueChange={(v) => setStatus(v as DeliveryStatus)}
						disabled={loading}
					>
						<SelectTrigger id="status" className="w-full">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex justify-end items-center gap-2">
				<Button
					type="button"
					variant="outline"
					disabled={loading}
					onClick={handleCancel}
				>
					Cancelar
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? "Salvando..." : "Salvar"}
				</Button>
			</div>
		</form>
	)
}
