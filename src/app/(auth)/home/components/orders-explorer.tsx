"use client"

import { useEffect, useMemo, useState } from "react"
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	getSortedRowModel,
	useReactTable,
	GroupingState,
	RowSelectionState,
} from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { OrderItemRow } from "@/types/Order"
import { ordersColumns } from "./orders-columns"
import { cn } from "@/lib/utils"
import { OrderStatusLegend } from "./order-status-legend"
import DeliveryPlanner from "../../delivery/components/delivery-planner"

type ViewMode = "flat" | "by_order" | "by_product"

const GROUPING_BY_VIEW: Record<ViewMode, GroupingState> = {
	flat: [],
	by_order: ["cod_order"],
	by_product: ["product_name"],
}

interface OrdersExplorerProps {
	rows: OrderItemRow[]
	isLoading?: boolean
	// devolve os itens selecionados (linha a linha) + a lista única de pedidos selecionados
	onSelectionChange?: (selection: {
		items: OrderItemRow[]
		orderCodes: (string | number)[]
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
	onSelectionChange,
}: OrdersExplorerProps) {
	const [view, setView] = useState<ViewMode>("by_order")
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [plannerOpen, setPlannerOpen] = useState(false)

	const table = useReactTable({
		data: rows,
		columns: ordersColumns,
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

	// pedidos únicos presentes na seleção
	const selectedOrderCodes = useMemo(() => {
		return Array.from(new Set(selectedLeafRows.map((item) => item.cod_order)))
	}, [selectedLeafRows])

	// só notifica o pai quando o resultado derivado muda de fato
	useEffect(() => {
		onSelectionChange?.({
			items: selectedLeafRows,
			orderCodes: selectedOrderCodes,
		})
	}, [selectedLeafRows, selectedOrderCodes, onSelectionChange])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
					<TabsList>
						<TabsTrigger value="by_order">Por Pedido</TabsTrigger>
						{/* <TabsTrigger value="by_product">Por Produto</TabsTrigger> */}
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
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className={cn(
											row.getIsGrouped() && "bg-gray-50/70 font-medium",
											row.getIsSelected() && "bg-blue-50",
										)}
									>
										{row.getVisibleCells().map((cell) => {
											// coluna de seleção: sempre renderiza o checkbox,
											// tanto em linha de grupo quanto em linha normal
											if (cell.column.id === "select") {
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
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={ordersColumns.length}
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
					// TODO: enviar para o backend
					console.log("cargas confirmadas", cargos)
					setPlannerOpen(false)
					setRowSelection({})
				}}
			/>
		</div>
	)
}
