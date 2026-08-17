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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useProductMutations } from "@/hooks/products/use-product-mutations"
import { Product } from "@/schemas/Product"
import { parseNumberBR } from "@/utils/format-numbers"
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
	unit_weight: number
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
		name_code: product?.name_code || "",
		name: product?.name || "",
		code: product?.code || "",
		unit: product?.unit || "",
		unit_weight: product?.unit_weight || "",
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
			...form,
			unit_weight: form.unit_weight ? parseNumberBR(form.unit_weight) : null,
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
			<div className="grid grid-cols-3 gap-2">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="name-products">Nome</Label>
					<Input
						id="name-products"
						placeholder="Descrição/nome do produto"
						value={form.name.toUpperCase()}
						onChange={(e) =>
							setForm({ ...form, name: e.target.value.toUpperCase() })
						}
						disabled={loading || isEdit}
					/>
					<span className="text-xs px-2.5 text-muted-foreground">
						{form.name_code}
					</span>
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<RadioGroup
						value={form.active ? "true" : "false"}
						onValueChange={(v) => handleChange("active", v === "true")}
						disabled={loading}
						className="flex items-center gap-4 h-9"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="true" id="status-active" />
							<Label htmlFor="status-active" className="font-normal">
								Ativo
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="false" id="status-inactive" />
							<Label htmlFor="status-inactive" className="font-normal">
								Inativo
							</Label>
						</div>
					</RadioGroup>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="code-product">Código</Label>
					<Input
						id="code-product"
						placeholder="Código"
						value={form.code}
						onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
						disabled={loading}
						required
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="unit-product">Unidade</Label>
					<Select
						value={form.unit}
						onValueChange={(v) => handleChange("unit", v)}
						disabled={loading}
					>
						<SelectTrigger id="unit-product" className="w-full">
							<SelectValue placeholder="Unidade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="UN">UN</SelectItem>
							<SelectItem value="CX">CX</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label htmlFor="unit-weight">Peso (Kg)</Label>
					<Input
						id="unit-weight"
						placeholder="Peso do produto pela unidade"
						value={form.unit_weight}
						onChange={(e) =>
							handleChange("unit_weight", e.target.value.toUpperCase())
						}
						disabled={loading}
					/>
				</div>
			</div>

			<div className="flex justify-between items-center">
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
									permanentemente o produto <strong>{product?.name}</strong>.
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
