"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderItemRow } from "@/types/Order"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrencyBR } from "@/utils/format-numbers"
import { ProductQuantityCheck } from "@/hooks/orders/use-products-quantity-check"
import { AlertCircle, CheckCircle2, Loader2, PauseCircle } from "lucide-react"

type GroupStockStatus = "in_stock" | "partial" | "no_stock" | "on_hold" | null

function renderStockStatusBadge(status: GroupStockStatus) {
	if (status === "on_hold") {
		return (
			<div className="flex items-center justify-center gap-1 text-gray-500">
				<PauseCircle className="h-4 w-4" />
				<span className="text-xs">Em espera</span>
			</div>
		)
	}
	if (status === "in_stock") {
		return (
			<div className="flex items-center justify-center gap-1 text-green-600">
				<CheckCircle2 className="h-4 w-4" />
				<span className="text-xs">Ok</span>
			</div>
		)
	}
	if (status === "no_stock") {
		return (
			<div className="flex items-center justify-center gap-1 text-red-600">
				<AlertCircle className="h-4 w-4" />
				<span className="text-xs">Em falta</span>
			</div>
		)
	}
	if (status === "partial") {
		return (
			<div className="flex items-center justify-center gap-1 text-amber-600">
				<AlertCircle className="h-4 w-4" />
				<span className="text-xs">Parcial</span>
			</div>
		)
	}
	return <div className="text-center text-gray-300">—</div>
}

// resume os status individuais dos itens de um grupo (pedido ou produto)
// em um único status — mesma regra usada pelo backend em
// _aggregate_order_stock_status, mas recalculada aqui pra também
// funcionar na view "por produto", que agrupa por outro critério
function aggregateGroupStockStatus(
	itemStatuses: (OrderItemRow["stock_item_status"] | undefined)[],
): GroupStockStatus {
	if (itemStatuses.length === 0) return null

	if (itemStatuses.every((s) => s === "on_hold")) return "on_hold"

	// itens em hold não entram na conta de suficiente/insuficiente —
	// eles não disputaram estoque, então não representam falta real
	const relevant = itemStatuses.filter((s) => s !== "on_hold")
	if (relevant.length === 0) return "on_hold"

	if (relevant.every((s) => s === "in_stock")) return "in_stock"
	if (relevant.every((s) => s === "no_stock")) return "no_stock"
	return "partial"
}

/**
 * Colunas usadas pela MESMA tabela nas 3 visões. O que muda entre
 * "flat", "por pedido" e "por produto" não é a definição de colunas,
 * e sim o estado `grouping` passado ao useReactTable (ver orders-explorer.tsx).
 *
 * Colunas numéricas têm `aggregationFn` definido, para que quando o
 * TanStack Table agrupar linhas ele saiba somar quantidade e valor
 * automaticamente nas linhas de grupo.
 */

interface GetColumnsArgs {
	stockByProduct?: Record<string, ProductQuantityCheck>
	isCheckingStock?: boolean
	userRole?: "admin" | "operator" | "user"
	view: "flat" | "by_order" | "by_product"
	pendingHoldOrderId?: string | null
	onToggleHold?: (orderId: string, nextValue: boolean) => void
}

export function getOrdersColumns({
	stockByProduct,
	isCheckingStock,
	userRole,
	view,
	pendingHoldOrderId,
	onToggleHold,
}: GetColumnsArgs): ColumnDef<OrderItemRow>[] {
	const canToggleHold = userRole === "admin" || userRole === "operator"

	return [
		{
			id: "select",
			header: () => <div className="text-center">Selecione</div>,
			cell: ({ row }) => (
				<div
					className="flex justify-center"
					onClick={(e) => e.stopPropagation()} // não deve disparar o expand do grupo
				>
					<Checkbox
						checked={
							row.getIsSelected()
								? true
								: row.getIsSomeSelected()
									? "indeterminate"
									: false
						}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Selecionar pedido"
					/>
				</div>
			),
			size: 36,
			enableGrouping: false,
			enableSorting: false,
		},
		{
			accessorKey: "cod_order",
			header: () => <div className="text-left">Pedido (itens)</div>,
			size: 80,
			enableGrouping: true,
			aggregationFn: "count", // no grupo "por pedido", mostra a contagem de itens
		},
		{
			accessorKey: "order_date",
			header: () => <div className="text-center">Data</div>,
			size: 60,
			cell: ({ row }) => {
				const raw = row.getValue("order_date") as string
				const date = new Date(raw)
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{date.toLocaleDateString("pt-BR")}
					</div>
				)
			},
			enableGrouping: false,
		},
		{
			id: "stock_status",
			header: () => <div className="text-center">Estoque</div>,
			size: 100,
			enableGrouping: false,
			cell: ({ row }) => {
				if (row.getIsGrouped()) return null
				return renderStockStatusBadge(row.original.stock_item_status ?? null)
			},
			aggregationFn: (_columnId, leafRows) => {
				const statuses = leafRows.map((r) => r.original.stock_item_status)
				return aggregateGroupStockStatus(statuses)
			},
			aggregatedCell: (info) =>
				renderStockStatusBadge(info.getValue<GroupStockStatus>()),
		},
		{
			id: "stock_hold_toggle",
			header: () => <div className="text-center">Em espera</div>,
			meta: { align: "center" },
			size: 70,
			enableGrouping: false,
			cell: ({ row }) => {
				// Na view "por pedido", a linha de grupo (depth 0) já
				// controla o hold do pedido inteiro — as linhas-folha
				// expandidas embaixo dela (depth > 0) não precisam do
				// checkbox de novo, já que hold é sempre do pedido todo.
				const isLeafUnderOrderGroup = view === "by_order" && row.depth > 0
				if (isLeafUnderOrderGroup) return null

				const original = row.getIsGrouped()
					? row.subRows[0]?.original
					: row.original

				if (!original) return null
				const { order_id, stock_hold } = original
				const isPending = pendingHoldOrderId === order_id

				if (isPending) {
					return (
						<div className="flex justify-center" title="Atualizando...">
							<Loader2 className="h-4 w-4 animate-spin text-gray-400" />
						</div>
					)
				}

				if (!canToggleHold) {
					// "user" só visualiza o estado, sem poder alterar
					return (
						<div
							className="flex justify-center text-gray-400"
							title="Sem permissão para alterar"
						>
							{stock_hold ? <PauseCircle className="h-4 w-4" /> : null}
						</div>
					)
				}

				return (
					<div
						className="flex justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<Checkbox
							checked={stock_hold}
							onCheckedChange={(value) => onToggleHold?.(order_id, !!value)}
							aria-label="Aguardar estoque deste pedido"
						/>
					</div>
				)
			},
		},
		{
			accessorKey: "operation_type",
			header: () => <div className="text-center">Tipo</div>,
			size: 60,
			cell: ({ row }) => {
				const type = row.getValue("operation_type") as string
				const typeLabel: Record<string, string> = {
					sale: "VENDA",
					tasting: "DEGUSTAÇÃO",
					bonus: "BONIFICAÇÃO",
				}

				return <div className="flex justify-center">{typeLabel[type]}</div>
			},
			enableGrouping: true,
		},
		{
			accessorKey: "client_name",
			header: () => <div className="text-left">Cliente</div>,
			meta: { align: "left" },
			size: 120,
			cell: ({ row }) => {
				const client_name = row.getValue("client_name")
				return <div className="flex justify-left">{client_name as string}</div>
			},
			enableGrouping: true,
		},
		{
			accessorKey: "product_name",
			header: () => <div className="text-left">Produto</div>,
			meta: { align: "left", color: "draft" },
			size: 120,
			cell: ({ row }) => {
				const product_name = row.getValue("product_name")
				return <div className="flex justify-left">{product_name as string}</div>
			},
			enableGrouping: true,
			aggregationFn: "count", // no grupo "por produto", mostra em quantos itens aparece
		},
		{
			accessorKey: "product_code",
			header: () => <div className="text-center">Cód. Produto</div>,
			size: 60,
			cell: ({ row }) => {
				const product_code = row.getValue("product_code")
				return (
					<div className="flex justify-center">{product_code as string}</div>
				)
			},
			enableGrouping: false,
		},
		{
			accessorKey: "quantity",
			header: () => <div className="text-center">Quantidade</div>,
			meta: { align: "center", color: "draft" },
			size: 60,
			aggregationFn: "sum",
			cell: ({ row }) => {
				const quantity = Number(row.getValue("quantity")).toLocaleString(
					"pt-BR",
				)
				return <div className="flex justify-center">{quantity}</div>
			},
			aggregatedCell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
		},
		{
			accessorKey: "item_total_volume",
			header: () => <div className="text-center">Volume</div>,
			meta: { align: "center", color: "draft" },
			size: 60,
			aggregationFn: "sum",
			cell: ({ row }) => {
				const volume = Number(row.getValue("item_total_volume")).toLocaleString(
					"pt-BR",
				)
				return <div className="flex justify-center">{volume}</div>
			},
			aggregatedCell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
		},
		{
			accessorKey: "item_total_weight",
			header: () => <div className="text-center">Peso</div>,
			meta: { align: "center", color: "draft" },
			size: 60,
			aggregationFn: "sum",
			cell: ({ row }) => {
				const total = Number(row.getValue("item_total_weight"))
				return (
					<div className="flex justify-center">
						{total.toLocaleString("pt-BR")}
					</div>
				)
			},
			aggregatedCell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
		},
		{
			accessorKey: "item_total_value",
			header: () => <div className="text-center">Valor Total</div>,
			meta: { align: "center", color: "draft" },
			size: 60,
			aggregationFn: "sum",
			cell: ({ row }) => {
				const total_value = formatCurrencyBR(
					Number(row.getValue("item_total_value")),
				)
				return <div className="flex justify-left">{total_value}</div>
			},
			aggregatedCell: (info) => formatCurrencyBR(Number(info.getValue())),
		},
		{
			accessorKey: "status",
			header: () => <div className="text-center">Status</div>,
			size: 60,
			cell: ({ row }) => {
				const status = row.getValue("status") as string
				const statusColors: Record<string, string> = {
					in_progress: "bg-blue-500",
					concluded: "bg-green-500",
					canceled: "bg-red-500",
				}

				return (
					<div className="flex justify-center">
						<span
							className={`inline-block w-3 h-3 rounded-full ${statusColors[status] || "bg-yellow-400"}`}
						/>
					</div>
				)
			},
		},
	]
}
