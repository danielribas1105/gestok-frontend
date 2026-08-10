"use client"

import { useState } from "react"
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	getSortedRowModel,
	useReactTable,
	GroupingState,
} from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronRight } from "lucide-react"
import { OrderItemRow } from "@/types/Order"
import { ordersColumns } from "./orders-columns"

type ViewMode = "flat" | "by_order" | "by_product"

// Cada modo de visão corresponde apenas a um `grouping` diferente,
// aplicado sobre a MESMA lista de linhas (item a item).
const GROUPING_BY_VIEW: Record<ViewMode, GroupingState> = {
	flat: [],
	by_order: ["cod_order"],
	by_product: ["product_name"],
}

interface OrdersExplorerProps {
	rows: OrderItemRow[]
	isLoading?: boolean
}

// Recebe os dados prontos via prop — a busca e o cálculo do summary
// acontecem uma única vez, lá em cima no page.tsx (useOrdersViews),
// e são compartilhados com o SummaryWrapper. Isso evita fetch duplicado
// e garante que os totais do Summary batam com o que a tabela mostra.
export function OrdersExplorer({ rows, isLoading }: OrdersExplorerProps) {
	const [view, setView] = useState<ViewMode>("by_order")

	const table = useReactTable({
		data: rows,
		columns: ordersColumns,
		state: {
			grouping: GROUPING_BY_VIEW[view],
		},
		onGroupingChange: () => {}, // grouping é controlado pelas abas, não pelo usuário clicando no header
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		autoResetExpanded: false,
	})

	return (
		<div className="flex flex-col gap-4">
			<Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
				<TabsList>
					<TabsTrigger value="by_order">Por Pedido</TabsTrigger>
					<TabsTrigger value="by_product">Por Produto</TabsTrigger>
					<TabsTrigger value="flat">Linha a Linha</TabsTrigger>
				</TabsList>
			</Tabs>

			{isLoading ? (
				<div className="py-10 text-center text-gray-400">Carregando...</div>
			) : (
				<div className="overflow-x-auto rounded-md border">
					<table className="w-full text-sm">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="border-b bg-gray-50">
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-3 py-2 text-left font-medium text-gray-600"
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className={
										row.getIsGrouped()
											? "border-b bg-gray-50/70 font-medium"
											: "border-b hover:bg-gray-50"
									}
								>
									{row.getVisibleCells().map((cell) => {
										// Célula da coluna pela qual o grupo foi formado:
										// mostra o valor + botão de expandir/recolher
										if (cell.getIsGrouped()) {
											return (
												<td key={cell.id} className="px-3 py-2">
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
												</td>
											)
										}

										// Célula agregada (soma de quantidade/valor no grupo)
										if (cell.getIsAggregated()) {
											return (
												<td key={cell.id} className="px-3 py-2">
													{flexRender(
														cell.column.columnDef.aggregatedCell ??
															cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											)
										}

										// Célula "apagada" nas linhas de grupo (não faz sentido mostrar)
										if (cell.getIsPlaceholder()) {
											return <td key={cell.id} className="px-3 py-2" />
										}

										// Célula normal (linha de detalhe / modo flat)
										return (
											<td key={cell.id} className="px-3 py-2">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
