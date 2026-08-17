"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderItemRow } from "@/types/Order"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrencyBR } from "@/utils/format-numbers"

/**
 * Colunas usadas pela MESMA tabela nas 3 visões. O que muda entre
 * "flat", "por pedido" e "por produto" não é a definição de colunas,
 * e sim o estado `grouping` passado ao useReactTable (ver orders-explorer.tsx).
 *
 * Colunas numéricas têm `aggregationFn` definido, para que quando o
 * TanStack Table agrupar linhas ele saiba somar quantidade e valor
 * automaticamente nas linhas de grupo.
 */
export const ordersColumns: ColumnDef<OrderItemRow>[] = [
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
			return <div className="flex justify-center">{product_code as string}</div>
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
			const quantity = Number(row.getValue("quantity")).toLocaleString("pt-BR")
			return <div className="flex justify-center">{quantity}</div>
		},
		aggregatedCell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
	},
	{
		accessorKey: "item_total_weight",
		header: () => <div className="text-center">Peso Total</div>,
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
		meta: { color: "draft" },
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
]
