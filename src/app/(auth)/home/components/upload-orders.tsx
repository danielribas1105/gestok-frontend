"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function UploadOrders({
	open,
	onClose,
	onSuccess,
}: {
	open: boolean
	onClose: () => void
	onSuccess: () => void
}) {
	const [file, setFile] = useState<File | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const handleSubmit = async () => {
		if (!file) {
			toast.error("Selecione um arquivo antes de enviar")
			return
		}

		setIsUploading(true)
		const formData = new FormData()
		formData.append("file", file)

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/upload`, {
				method: "POST",
				body: formData,
			})

			if (!res.ok) throw new Error("Erro ao processar o arquivo")

			toast.success("Pedidos atualizados com sucesso!")
			onSuccess()
			onClose()
			setFile(null)
		} catch (err) {
			toast.error("Erro ao importar arquivo")
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Atualizar pedidos via Excel/CSV</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<Label>Selecione o arquivo (.xlsx ou .csv)</Label>
					<Input
						type="file"
						accept=".xlsx,.xls,.csv"
						onChange={(e) => setFile(e.target.files?.[0] ?? null)}
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button onClick={handleSubmit} disabled={isUploading}>
						{isUploading ? "Enviando..." : "Enviar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
