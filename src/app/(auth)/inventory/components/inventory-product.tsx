"use client"

import { useMemo, useState } from "react"
import {
	Package,
	CheckCircle2,
	Loader2,
	ClipboardList,
	ArrowDownCircle,
	ArrowUpCircle,
	AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { Inventory, StockMovement } from "@/schemas/Inventory"
import { useInventoryMutations } from "@/hooks/inventory/use-inventory-mutations"
import type { StockMovementPayload } from "./inventory-form"

type MovementType = StockMovement["movement_type"] // "in" | "out"

interface InventoryProductFormProps {
	/** Linha da tabela de inventário que foi clicada. */
	product: Inventory
	/** Chamado ao concluir a atualização com sucesso (ex.: fechar modal). */
	onSuccess?: () => void
	/** Chamado ao cancelar (ex.: fechar o modal). */
	onCancel?: () => void
}

const MOVEMENT_OPTIONS: {
	value: MovementType
	label: string
	icon: typeof ArrowDownCircle
}[] = [
	{ value: "in", label: "Entrada", icon: ArrowDownCircle },
	{ value: "out", label: "Saída", icon: ArrowUpCircle },
]

export default function InventoryProductForm({
	product,
	onSuccess,
	onCancel,
}: InventoryProductFormProps) {
	const [movementType, setMovementType] = useState<MovementType>("in")
	const [documentNumber, setDocumentNumber] = useState("")
	const [quantityDraft, setQuantityDraft] = useState("")
	const [observations, setObservations] = useState("")
	const [formError, setFormError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [confirmOpen, setConfirmOpen] = useState(false)

	const { createInventoryBatch } = useInventoryMutations()

	const quantityLabel = useMemo(() => {
		if (movementType === "out") return "Quantidade a remover"
		return "Quantidade a adicionar"
	}, [movementType])

	const preview = useMemo(() => {
		const value = Number(quantityDraft)
		if (!quantityDraft || Number.isNaN(value)) return null

		const current = product.current_quantity
		if (movementType === "in") return current + value
		return current - value
	}, [quantityDraft, movementType, product.current_quantity])

	function resetForm() {
		setMovementType("in")
		setDocumentNumber("")
		setQuantityDraft("")
		setObservations("")
		setFormError(null)
	}

	function buildPayload(): StockMovementPayload[] {
		return [
			{
				product_id: product.product_id,
				quantity: Number(quantityDraft),
				movement_type: movementType,
				code: documentNumber.trim(),
				observations:
					observations.trim() ||
					(movementType === "out"
						? "Saída de caixas via conferência de estoque"
						: "Recebimento de caixas via conferência de estoque"),
			},
		]
	}

	/** Valida os campos e decide se precisa confirmar antes de enviar. */
	function handleUpdate() {
		setFormError(null)

		const value = Number(quantityDraft)
		if (!quantityDraft || Number.isNaN(value) || value <= 0) {
			setFormError("Informe uma quantidade maior que zero.")
			return
		}

		// Romaneio só é obrigatório na entrada.
		if (movementType === "in" && !documentNumber.trim()) {
			setFormError("Informe o número do romaneio de entrada.")
			return
		}

		// Toda saída precisa de confirmação explícita do usuário.
		if (movementType === "out") {
			setConfirmOpen(true)
			return
		}

		void submitPayload()
	}

	/** Envio efetivo ao backend. */
	async function submitPayload() {
		try {
			setIsSubmitting(true)
			setFormError(null)
			await createInventoryBatch.mutateAsync(buildPayload())
			resetForm()
			onSuccess?.()
		} catch (err) {
			setFormError(
				err instanceof Error
					? err.message
					: "Não foi possível atualizar o estoque. Tente novamente.",
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	function handleConfirmOut() {
		setConfirmOpen(false)
		void submitPayload()
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Resumo do produto selecionado */}
			<div className="flex items-start gap-3 rounded-xl border bg-muted/30 py-2 px-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
					<Package className="size-4 text-muted-foreground" />
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<span className="truncate text-sm font-medium">
						{product.product_name}
					</span>
					{product.product_code && (
						<span className="text-xs text-muted-foreground">
							Código: {product.product_code}
						</span>
					)}
					<div className="mt-1 flex flex-wrap gap-1.5">
						<Badge variant="secondary" className="font-normal">
							Atual: {product.current_quantity.toLocaleString("pt-BR")}
						</Badge>
						<Badge variant="secondary" className="font-normal">
							Reservado: {product.reserved_quantity.toLocaleString("pt-BR")}
						</Badge>
						<Badge variant="secondary" className="font-normal">
							Disponível: {product.available_quantity.toLocaleString("pt-BR")}
						</Badge>
					</div>
				</div>
			</div>

			{/* Tipo de movimentação */}
			<div className="flex flex-col gap-1.5">
				<Label>Tipo de movimentação</Label>
				<div className="grid grid-cols-2 gap-2">
					{MOVEMENT_OPTIONS.map(({ value, label, icon: Icon }) => (
						<button
							key={value}
							type="button"
							onClick={() => {
								setMovementType(value)
								setFormError(null)
							}}
							className={cn(
								"flex justify-center items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors",
								movementType === value
									? "border-primary bg-primary/5 text-primary"
									: "text-muted-foreground hover:bg-muted/50",
							)}
						>
							<Icon className="size-4" />
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Romaneio / documento */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="document-number" className="flex items-center gap-1.5">
					<ClipboardList className="size-4 text-muted-foreground" />
					Número do romaneio / pedido
					{movementType === "out" && (
						<span className="font-normal text-muted-foreground">
							(opcional)
						</span>
					)}
				</Label>
				<Input
					id="document-number"
					placeholder="Ex: ROM0101/208933"
					value={documentNumber}
					onChange={(e) => {
						setDocumentNumber(e.target.value)
						setFormError(null)
					}}
				/>
			</div>

			{/* Quantidade */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="quantity-draft">{quantityLabel}</Label>
				<Input
					id="quantity-draft"
					type="number"
					min={0}
					inputMode="numeric"
					placeholder="0"
					value={quantityDraft}
					onChange={(e) => {
						setQuantityDraft(e.target.value)
						setFormError(null)
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault()
							handleUpdate()
						}
					}}
				/>
				{preview !== null && (
					<p className="text-xs text-muted-foreground">
						Estoque resultante:{" "}
						<span className="font-medium text-foreground">
							{preview.toLocaleString("pt-BR")}
						</span>
					</p>
				)}
			</div>

			{/* Observações */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="observations">Observações</Label>
				<Textarea
					id="observations"
					placeholder="Opcional"
					value={observations}
					onChange={(e) => setObservations(e.target.value)}
					className="min-h-20 resize-none"
				/>
			</div>

			{formError && <p className="text-sm text-destructive">{formError}</p>}

			<Separator />

			{/* Ações */}
			<div className="flex items-center justify-end gap-2">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
				)}
				<Button
					type="button"
					onClick={handleUpdate}
					disabled={isSubmitting || !quantityDraft}
					className="min-w-36"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-1.5 size-4 animate-spin" />
							Atualizando...
						</>
					) : (
						<>
							<CheckCircle2 className="mr-1.5 size-4" />
							Atualizar estoque
						</>
					)}
				</Button>
			</div>

			{/* Confirmação obrigatória para toda saída de estoque */}
			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="size-4 text-destructive" />
							Confirmar saída de estoque?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Você está removendo{" "}
							<span className="font-medium text-foreground">
								{quantityDraft || 0}
							</span>{" "}
							unidades de{" "}
							<span className="font-medium text-foreground">
								{product.product_name}
							</span>
							{documentNumber.trim() ? (
								<>
									{" "}
									(romaneio/pedido{" "}
									<span className="font-medium text-foreground">
										{documentNumber.trim()}
									</span>
									).
								</>
							) : (
								<>
									{" "}
									sem informar um número de romaneio ou pedido. Saídas manuais
									sem código podem gerar inconsistências no rastreamento
									logístico.
								</>
							)}{" "}
							Deseja realizar essa operação?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmOut}
							disabled={isSubmitting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-1.5 size-4 animate-spin" />
									Confirmando...
								</>
							) : (
								"Confirmar saída"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
