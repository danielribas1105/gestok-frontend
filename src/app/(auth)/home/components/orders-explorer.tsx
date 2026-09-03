"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDeliveryMutations } from "@/hooks/delivery/use-delivery-mutations"
import { ProductQuantityCheck } from "@/hooks/orders/use-products-quantity-check"
import { cargoTotalWeight } from "@/lib/functions/delivery"
import { cn } from "@/lib/utils"
import { Cargo, DeliveryCreatePayload } from "@/types/Delivery"
import { OrderItemRow } from "@/types/Order"
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	getSortedRowModel,
	GroupingState,
	RowSelectionState,
	useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import DeliveryPlanner from "../../delivery/components/delivery-planner"
import { OrderStatusLegend } from "./order-status-legend"
import { getOrdersColumns } from "./orders-columns"

type ViewMode = "flat" | "by_order" | "by_product"

const GROUPING_BY_VIEW: Record<ViewMode, GroupingState> = {
	flat: [],
	by_order: ["cod_order"],
	by_product: ["product_name"],
}

// achata as cargas programadas em um array de Delivery (1 item por pedido)
function buildDeliveriesPayload(
	cargos: Cargo[],
): Partial<DeliveryCreatePayload>[] {
	return cargos.flatMap((cargo) =>
		cargo.orders.map((order) => ({
			order_id: order.order_id,
			car_id: cargo.car_id,
			user_id: cargo.user_id,
			invoice: "Aguardando NF",
			weight: String(order.total_kg ?? cargoTotalWeight(cargo)),
			observations: "",
			status: cargo.status, // "pending" já vem de createCargo()
			scheduled_at: cargo.schedule_date ?? null,
			delivered_confirmed: false,
		})),
	)
}

interface OrdersExplorerProps {
	rows: OrderItemRow[]
	isLoading?: boolean
	stockByProduct?: Record<string, ProductQuantityCheck> // product_id -> check
	isCheckingStock?: boolean
	userRole?: "admin" | "operator" | "user"
	pendingHoldOrderId?: string | null
	onToggleHold?: (orderId: string, nextValue: boolean) => void
	// devolve os itens selecionados (linha a linha) + pedidos selecionados
	// (código de exibição e id real, usados em contextos diferentes)
	onSelectionChange?: (selection: {
		items: OrderItemRow[]
		orderCodes: (string | number)[]
		orderIds: string[]
		itemIds: string[]
	}) => void
}

function alignClass(align?: "left" | "center" | "right") {
	switch (align) {
		case "center":
			return "text-center"
		case "right":
			return "text-right"
		default:
			return "text-left"
	}
}

function textColor(color?: "draft") {
	switch (color) {
		case "draft":
			return "text-muted-foreground"
		default:
			return "text-foreground"
	}
}

export function OrdersExplorer({
	rows,
	isLoading,
	stockByProduct,
	isCheckingStock,
	userRole,
	pendingHoldOrderId,
	onToggleHold,
	onSelectionChange,
}: OrdersExplorerProps) {
	const [view, setView] = useState<ViewMode>("by_order")
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [plannerOpen, setPlannerOpen] = useState(false)
	const { createDelivery } = useDeliveryMutations()

	// colunas dependem do mapa de estoque (ícone/texto por linha), por
	// isso viram uma função memoizada em vez de array estático
	const columns = useMemo(
		() =>
			getOrdersColumns({
				stockByProduct,
				isCheckingStock,
				userRole,
				pendingHoldOrderId,
				view,
				onToggleHold,
			}),
		[
			stockByProduct,
			isCheckingStock,
			userRole,
			pendingHoldOrderId,
			view,
			onToggleHold,
		],
	)

	const table = useReactTable({
		data: rows,
		columns, //columns: ordersColumns,
		state: {
			grouping: GROUPING_BY_VIEW[view],
			rowSelection,
		},
		onGroupingChange: () => {},
		onRowSelectionChange: setRowSelection,
		enableRowSelection: true,
		enableSubRowSelection: true, // marcar o grupo marca os itens filhos (pedido inteiro)
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		autoResetExpanded: false,
	})

	// linhas "folha" selecionadas (sem as linhas de grupo, que não têm `original` de item real)
	const selectedLeafRows: OrderItemRow[] = useMemo(() => {
		return table
			.getSelectedRowModel()
			.rows.filter((r) => !r.getIsGrouped())
			.map((r) => r.original)
	}, [rowSelection, table])

	// pedidos únicos presentes na seleção (código de exibição, pra UI)
	const selectedOrderCodes = useMemo(() => {
		return Array.from(new Set(selectedLeafRows.map((item) => item.cod_order)))
	}, [selectedLeafRows])

	// ids reais dos pedidos selecionados (uuid), pra chamadas ao backend
	// (ex: verificação de estoque, programação de entrega)
	const selectedOrderIds = useMemo(() => {
		return Array.from(new Set(selectedLeafRows.map((item) => item.order_id)))
	}, [selectedLeafRows])

	const selectedItemIds = useMemo(() => {
		return selectedLeafRows.map((item) => item.item_id)
	}, [selectedLeafRows])

	// só notifica o pai quando o resultado derivado muda de fato
	useEffect(() => {
		onSelectionChange?.({
			items: selectedLeafRows,
			orderCodes: selectedOrderCodes,
			orderIds: selectedOrderIds,
			itemIds: selectedItemIds,
		})
	}, [
		selectedLeafRows,
		selectedOrderCodes,
		selectedOrderIds,
		selectedItemIds,
		onSelectionChange,
	])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
					<TabsList>
						<TabsTrigger value="by_order">Por Pedido</TabsTrigger>
						<TabsTrigger value="by_product">Por Produto</TabsTrigger>
						<TabsTrigger value="flat">Linha a Linha</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="hidden md:flex justify-end">
					<OrderStatusLegend />
				</div>
			</div>

			{isLoading ? (
				<div className="py-10 text-center text-gray-400">Carregando...</div>
			) : (
				<div className="rounded-md border">
					<Table>
						<colgroup>
							{table.getVisibleLeafColumns().map((column) => (
								<col key={column.id} style={{ width: column.getSize() }} />
							))}
						</colgroup>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="bg-gray-50">
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="text-gray-600">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => {
									// pega o pedido de origem tanto em linha de grupo quanto em linha-folha,
									// pra saber se esse pedido está em hold
									const original = row.getIsGrouped()
										? row.subRows[0]?.original
										: row.original
									const isHeld = original?.stock_hold

									return (
										<TableRow
											key={row.id}
											className={cn(
												row.getIsGrouped() && "font-medium",
												isHeld
													? "bg-amber-50"
													: row.getIsGrouped()
														? "bg-gray-50/70"
														: row.getIsSelected()
															? "bg-blue-50"
															: undefined,
											)}
										>
											{row.getVisibleCells().map((cell) => {
												// coluna de seleção: sempre renderiza o checkbox,
												// tanto em linha de grupo quanto em linha normal
												if (
													cell.column.id === "select" ||
													cell.column.id === "stock_hold_toggle"
												) {
													return (
														<TableCell key={cell.id}>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext(),
															)}
														</TableCell>
													)
												}

												if (cell.getIsGrouped()) {
													return (
														<TableCell key={cell.id}>
															<button
																onClick={row.getToggleExpandedHandler()}
																className="flex items-center gap-1"
															>
																{row.getIsExpanded() ? (
																	<ChevronDown className="h-4 w-4" />
																) : (
																	<ChevronRight className="h-4 w-4" />
																)}
																{flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext(),
																)}
																<span className="text-gray-400">
																	({row.subRows.length})
																</span>
															</button>
														</TableCell>
													)
												}

												if (cell.getIsAggregated()) {
													return (
														<TableCell
															key={cell.id}
															className={`${alignClass(
																cell.column.columnDef.meta?.align,
															)} 
																${textColor(cell.column.columnDef.meta?.color)}`}
														>
															{flexRender(
																cell.column.columnDef.aggregatedCell ??
																	cell.column.columnDef.cell,
																cell.getContext(),
															)}
														</TableCell>
													)
												}

												if (cell.getIsPlaceholder()) {
													return <TableCell key={cell.id} />
												}

												return (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												)
											})}
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-gray-400"
									>
										Nenhum resultado.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{selectedOrderCodes.length > 0 && (
				<div className="sticky bottom-4 z-10 flex justify-center">
					<div className="flex items-center gap-4 rounded-full border bg-white px-5 py-2.5 shadow-lg">
						<span className="text-sm text-gray-600">
							{selectedOrderCodes.length} pedido(s) selecionado(s)
						</span>
						<button
							onClick={() => setPlannerOpen(true)}
							className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
						>
							Programar Entrega
						</button>
					</div>
				</div>
			)}

			<DeliveryPlanner
				open={plannerOpen}
				onOpenChange={setPlannerOpen}
				selectedItems={selectedLeafRows}
				onConfirm={(cargos) => {
					console.log("cargas confirmadas", cargos)
					const deliveries = buildDeliveriesPayload(cargos)
					console.log("deliveries", deliveries)
					createDelivery.mutate(deliveries, {
						onSuccess: () => {
							setPlannerOpen(false)
							setRowSelection({})
						},
					})
				}}
			/>
		</div>
	)
}
