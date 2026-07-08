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
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useProductMutations } from "@/hooks/products/use-product-mutations"
import { Product } from "@/schemas/Product"
import { formatCurrencyBR, parseValueM3 } from "@/utils/format-numbers"
import { useState } from "react"

interface ProductFormProps {
	product?: Product
	onSuccess?: () => void
	onCancel?: () => void
}

type ProductFormState = {
	description: string
	code: string
	unit: string
	value: number
	active: boolean
}

export default function ProductForm({
	product,
	onSuccess,
	onCancel,
}: ProductFormProps) {
	const isEdit = !!product

	const { createProduct, updateProduct, deleteProduct } = useProductMutations()

	const initialForm = {
		description: product?.description || "",
		code: product?.code || "",
		unit: product?.unit || "",
		value: product?.value ? String(product.value).replace(".", ",") : "",
		active: product?.active ?? true,
	}

	const [form, setForm] = useState(initialForm)

	function handleChange(
		field: keyof ProductFormState,
		value: string | boolean,
	) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	//  CANCEL
	function handleCancel() {
		setForm(initialForm) // descarta qualquer alteração feita
		onCancel?.() // avisa o pai pra fechar o form/modal
	}

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			code: form.code,
			description: form.description,
			unit: form.unit,
			active: form.active,
			value: parseValueM3(form.value),
		}

		try {
			if (isEdit) {
				await updateProduct.mutateAsync({
					id: product!.id,
					data: payload,
				})
			} else {
				await createProduct.mutateAsync(payload)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!product) return

		try {
			await deleteProduct.mutateAsync(product.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createProduct.isPending ||
		updateProduct.isPending ||
		deleteProduct.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid grid-cols-1 gap-2">
				<div className="space-y-1">
					<Label htmlFor="description">Descrição</Label>
					<Input
						id="description"
						placeholder="Descrição/nome do produto"
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						disabled={loading}
					/>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-2">
				<div className="space-y-1">
					<Label htmlFor="code">Código</Label>
					<Input
						id="code"
						placeholder="Código"
						value={form.code}
						onChange={(e) => handleChange("code", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="unit">Unidade</Label>
					<Input
						id="unit"
						placeholder="Unidade (CX, PC, LOTE)"
						value={form.unit}
						onChange={(e) => handleChange("unit", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="value">Valor</Label>
					<Input
						id="value"
						placeholder="Valor"
						value={form.value}
						onChange={(e) => handleChange("value", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="status">Status *</Label>
					<Select
						value={form.active ? "true" : "false"}
						onValueChange={(v) => handleChange("active", v === "true")}
						disabled={loading}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="true">Ativo</SelectItem>
							<SelectItem value="false">Inativo</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteProduct.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o produto{" "}
									<strong>{product?.description}</strong>.
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

				{/* SUBMIT OR CANCEL */}
				<div className="flex items-center gap-2 ml-auto">
					<Button
						type="button"
						variant="outline"
						disabled={loading}
						onClick={handleCancel}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={loading}>
						{createProduct.isPending || updateProduct.isPending
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
