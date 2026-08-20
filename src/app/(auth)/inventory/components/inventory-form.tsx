"use client"

import { useMemo, useState } from "react"
import {
	Package,
	Plus,
	Trash2,
	Boxes,
	CheckCircle2,
	Loader2,
	ClipboardList,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { StockMovement } from "@/schemas/Inventory"
import { Product } from "@/schemas/Product"
import { useInventoryMutations } from "@/hooks/inventory/use-inventory-mutations"

/**
 * Produto disponível para seleção no formulário.
 * Normalmente vem de um GET /products no backend.
 */
export interface InventoryProduct {
	id: string
	name: string
	unit?: string // ex: "CX"
}

/** Item de recebimento já adicionado à listagem local. */
interface ReceivedItem {
	product_id: string
	product_name: string | null | undefined
	unit?: string
	quantity: number
}

/** Payload enviado ao backend ao clicar em "Atualizar". */
export type StockMovementPayload = Pick<
	StockMovement,
	"product_id" | "quantity" | "movement_type"
> & {
	code?: StockMovement["code"]
	observations?: StockMovement["observations"]
}

interface InventoryFormProps {
	/** Lista de produtos disponíveis para seleção (nome + id). */
	products: Product[]
	/**
	 * Valor inicial do número do romaneio (opcional). O usuário pode digitar
	 * ou ajustar esse valor no próprio formulário — ele é salvo em order_id.
	 * A mesma coluna guarda tanto o nº do romaneio de entrada quanto o
	 * order_id do pedido de saída, então o valor é sempre digitado aqui.
	 */
	defaultDocumentNumber?: string
	/** Chamado ao clicar em "Atualizar estoque" com a listagem consolidada. */
	onSubmit: (items: StockMovementPayload[]) => Promise<void> | void
	/** Chamado ao cancelar (ex.: fechar o modal). */
	onCancel?: () => void
}

export default function InventoryForm({
	products,
	defaultDocumentNumber,
	onSubmit,
	onCancel,
}: InventoryFormProps) {
	const [documentNumber, setDocumentNumber] = useState<string>(
		defaultDocumentNumber ?? "",
	)
	const [selectedProductId, setSelectedProductId] = useState<string>("")
	const [quantityDraft, setQuantityDraft] = useState<string>("")
	const [items, setItems] = useState<ReceivedItem[]>([])
	const [formError, setFormError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [justAdded, setJustAdded] = useState<string | null>(null)

	const { createInventoryBatch } = useInventoryMutations()

	const selectedProduct = useMemo(
		() => products.find((p) => p.id === selectedProductId) ?? null,
		[products, selectedProductId],
	)

	const totalBoxes = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items],
	)

	function resetDraft() {
		setSelectedProductId("")
		setQuantityDraft("")
		setFormError(null)
	}

	function handleAddProduct() {
		setFormError(null)

		if (!selectedProduct) {
			setFormError("Selecione um produto para adicionar.")
			return
		}

		const quantity = Number(quantityDraft)
		if (!quantityDraft || Number.isNaN(quantity) || quantity <= 0) {
			setFormError("Informe uma quantidade de caixas válida.")
			return
		}

		setItems((prev) => {
			const existing = prev.find((i) => i.product_id === selectedProduct.id)
			if (existing) {
				return prev.map((i) =>
					i.product_id === selectedProduct.id
						? { ...i, quantity: i.quantity + quantity }
						: i,
				)
			}
			return [
				...prev,
				{
					product_id: selectedProduct.id,
					product_name: selectedProduct.name,
					unit: selectedProduct.unit,
					quantity,
				},
			]
		})

		setJustAdded(selectedProduct.id)
		window.setTimeout(() => setJustAdded(null), 900)
		resetDraft()
	}

	function handleRemoveItem(productId: string) {
		setItems((prev) => prev.filter((i) => i.product_id !== productId))
	}

	function handleQuantityEdit(productId: string, rawValue: string) {
		const value = Number(rawValue)
		setItems((prev) =>
			prev.map((i) =>
				i.product_id === productId
					? { ...i, quantity: Number.isNaN(value) || value < 1 ? 1 : value }
					: i,
			),
		)
	}

	async function handleUpdate() {
		if (items.length === 0) {
			setFormError("Adicione ao menos um produto antes de atualizar.")
			return
		}

		const payload: StockMovementPayload[] = items.map((item) => ({
			product_id: item.product_id,
			quantity: item.quantity,
			movement_type: "in",
			code: documentNumber.trim(),
			observations: "Recebimento de caixas via conferência de estoque",
		}))

		console.log("payload", payload)
		try {
			setIsSubmitting(true)
			setFormError(null)
			await createInventoryBatch.mutateAsync(payload)
			setItems([])
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

	return (
		<div className="flex flex-col gap-4">
			{/* Romaneio de entrada — vai para order_id */}
			<div className="flex gap-1.5">
				<Label htmlFor="document-number" className="flex items-center gap-1.5">
					<ClipboardList className="size-4 text-muted-foreground" />
					Número do romaneio de entrada
				</Label>
				<Input
					id="document-number"
					placeholder="Ex: ROM0101/208933"
					value={documentNumber}
					onChange={(e) => {
						setDocumentNumber(e.target.value)
						setFormError(null)
					}}
					className="sm:max-w-xs"
				/>
			</div>
			{/* Bloco de seleção de produto */}
			<div className="rounded-xl border bg-muted/30 p-3">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="product-select">Produto</Label>
						<Select
							value={selectedProductId}
							onValueChange={(value) => {
								setSelectedProductId(value)
								setFormError(null)
							}}
						>
							<SelectTrigger id="product-select" className="w-full">
								<SelectValue placeholder="Selecione um produto" />
							</SelectTrigger>
							<SelectContent>
								{products.length === 0 && (
									<div className="px-2 py-3 text-sm text-muted-foreground">
										Nenhum produto disponível.
									</div>
								)}
								{products.map((product) => (
									<SelectItem key={product.id} value={product.id}>
										{product.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="quantity-draft">Qtd. caixas</Label>
						<Input
							id="quantity-draft"
							type="number"
							min={1}
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
									handleAddProduct()
								}
							}}
						/>
					</div>

					<Button
						type="button"
						onClick={handleAddProduct}
						className="sm:w-auto"
					>
						<Plus className="mr-1.5 size-4" />
						Adicionar
					</Button>
				</div>

				{formError && (
					<p className="mt-3 text-sm text-destructive">{formError}</p>
				)}
			</div>

			{/* Listagem de produtos adicionados */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm font-medium text-foreground">
						<Boxes className="size-4 text-muted-foreground" />
						Produtos recebidos
					</div>
					{items.length > 0 && (
						<Badge variant="secondary" className="font-normal">
							{items.length} {items.length === 1 ? "item" : "itens"} ·{" "}
							{totalBoxes} {totalBoxes === 1 ? "caixa" : "caixas"}
						</Badge>
					)}
				</div>

				{items.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 text-center">
						<Package className="size-8 text-muted-foreground/50" />
						<p className="text-sm text-muted-foreground">
							Nenhum produto adicionado ainda.
							<br />
							Selecione um produto e informe a quantidade de caixas recebidas.
						</p>
					</div>
				) : (
					<ScrollArea className="max-h-72 rounded-xl border">
						<div className="divide-y">
							{items.map((item) => (
								<div
									key={item.product_id}
									className={cn(
										"flex items-center gap-3 px-4 py-2 transition-colors duration-300",
										justAdded === item.product_id && "bg-primary/5",
									)}
								>
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<Package className="size-4 shrink-0 text-muted-foreground" />
										<span className="truncate text-sm font-medium">
											{item.product_name}
										</span>
									</div>

									<Input
										type="number"
										min={1}
										value={item.quantity}
										onChange={(e) =>
											handleQuantityEdit(item.product_id, e.target.value)
										}
										className="h-8 w-20 text-center"
									/>
									<span className="w-9 shrink-0 text-xs text-muted-foreground">
										{item.unit ?? "CX"}
									</span>

									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
										onClick={() => handleRemoveItem(item.product_id)}
									>
										<Trash2 className="size-4" />
										<span className="sr-only">Remover {item.product_name}</span>
									</Button>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</div>

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
					disabled={isSubmitting || items.length === 0}
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
		</div>
	)
}
