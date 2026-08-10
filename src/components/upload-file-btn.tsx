"use client"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useOrderMutations } from "@/hooks/orders/use-order-mutations"
import { Order } from "@/schemas/Order"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import CSVDataTable from "./csv-data-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { UploadFileModal } from "./upload-file-modal"
import { OrderCreatePayload } from "@/types/Order"

export default function UploadFileButton() {
	const [open, setOpen] = useState(false)
	const [previewOpen, setPreviewOpen] = useState(false)
	const [importing, setImporting] = useState(false)

	const [pendingOrders, setPendingOrders] = useState<OrderCreatePayload[]>([])
	const [tableData, setTableData] = useState<{
		data: any[]
		columns: string[]
	}>({ data: [], columns: [] })

	const { createOrdersBatch, createOrder } = useOrderMutations()

	function handleOrdersReady(
		payloads: OrderCreatePayload[],
		rawRows: Record<string, any>[],
		headers: string[],
	) {
		setPendingOrders(payloads)
		setTableData({ data: rawRows, columns: headers })
		setOpen(false)
		setPreviewOpen(true)
	}

	async function handleConfirmImport() {
		setImporting(true)
		try {
			await createOrdersBatch.mutateAsync(pendingOrders)
		} catch (err) {
			// tratar erro parcial se o backend retornar quais pedidos falharam
		} finally {
			setImporting(false)
			setPreviewOpen(false)
			setPendingOrders([])
			setTableData({ data: [], columns: [] })
		}
	}

	/* async function handleConfirmImport() {
		setImporting(true)
		let success = 0
		let failed = 0
		const failedOrders: string[] = []

		for (const payload of pendingOrders) {
			try {
				await createOrder.mutateAsync(payload)
				success++
			} catch {
				failed++
				failedOrders.push(payload.code)
			}
		}

		setImporting(false)
		setPreviewOpen(false)
		setPendingOrders([])
		setTableData({ data: [], columns: [] })

		if (failed === 0) {
			toast.success(`${success} pedido(s) importado(s) com sucesso 🎉`)
		} else {
			toast.warning(
				`${success} importado(s), ${failed} falharam (pedidos: ${failedOrders.join(", ")})`,
			)
		}
	} */

	/* const totalItems = pendingOrders.reduce((sum, o) => sum + o.items.length, 0)
	const totalValue = pendingOrders.reduce(
		(sum, o) =>
			sum + o.items.reduce((s, i) => s + i.quantity * i.unit_value, 0),
		0,
	) */

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
						<Plus />
						Carregar arquivo
					</Button>
				</TooltipTrigger>
				<TooltipContent>Fazer upload do arquivo de pedidos</TooltipContent>
			</Tooltip>

			<UploadFileModal
				open={open}
				onClose={() => setOpen(false)}
				onOrdersReady={handleOrdersReady}
			/>

			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent
					style={{
						width: "30vw",
						maxWidth: "40vw",
					}}
					className="max-w-5xl max-h-[85vh] overflow-auto"
				>
					<DialogHeader>
						<DialogTitle>Confirmar importação?</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<div className="flex flex-col gap-2">
							<p>
								<strong>{pendingOrders.length}</strong> pedido(s)
							</p>
							<p>
								<strong>{tableData.data.length}</strong> linha(s) processada(s)
							</p>
						</div>
					</DialogDescription>
					{/* Reaproveitando o CSVDataTable pra mostrar as linhas cruas */}
					{/* <CSVDataTable data={tableData.data} columns={tableData.columns} /> */}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setPreviewOpen(false)}
							disabled={importing}
						>
							Cancelar
						</Button>
						<Button onClick={handleConfirmImport} disabled={importing}>
							{importing && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
							{importing ? "Importando..." : "Confirmar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
