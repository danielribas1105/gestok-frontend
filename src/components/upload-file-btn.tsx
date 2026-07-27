"use client"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import { UploadFileModal } from "./upload-file-modal"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { OrderCreatePayload } from "@/hooks/orders/use-orders"
import { useOrderMutations } from "@/hooks/orders/use-order-mutations"
import CSVDataTable from "./csv-data-table"

export default function UploadFileButton() {
	const [open, setOpen] = useState(false)
	const [previewOpen, setPreviewOpen] = useState(false)
	const [importing, setImporting] = useState(false)

	const [pendingOrders, setPendingOrders] = useState<OrderCreatePayload[]>([])
	const [tableData, setTableData] = useState<{
		data: any[]
		columns: string[]
	}>({ data: [], columns: [] })

	const { createOrder } = useOrderMutations()

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
		let success = 0
		let failed = 0
		const failedOrders: number[] = []

		for (const payload of pendingOrders) {
			try {
				await createOrder.mutateAsync(payload)
				success++
			} catch {
				failed++
				failedOrders.push(payload.cod_order)
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
	}

	const totalItems = pendingOrders.reduce((sum, o) => sum + o.items.length, 0)
	const totalValue = pendingOrders.reduce(
		(sum, o) =>
			sum + o.items.reduce((s, i) => s + i.quantity * i.unit_value, 0),
		0,
	)

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
						<Plus />
						Carregar arquivo
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar novo arquivo</TooltipContent>
			</Tooltip>

			<UploadFileModal
				open={open}
				onClose={() => setOpen(false)}
				onOrdersReady={handleOrdersReady}
			/>

			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>
							Confirmar importação — {pendingOrders.length} pedido(s) /{" "}
							{tableData.data.length} linha(s)
						</DialogTitle>
					</DialogHeader>

					{/* Reaproveitando o CSVDataTable pra mostrar as linhas cruas */}
					<CSVDataTable data={tableData.data} columns={tableData.columns} />

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
							{importing ? "Importando..." : "Confirmar importação"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
