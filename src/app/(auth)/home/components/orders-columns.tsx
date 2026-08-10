"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderItemRow } from "@/types/Order"

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
		accessorKey: "cod_order",
		header: "Pedido",
		enableGrouping: true,
		aggregationFn: "count", // no grupo "por pedido", mostra a contagem de itens
	},
	{
		accessorKey: "order_date_formatted",
		header: "Data",
		enableGrouping: false,
	},
	{
		accessorKey: "status_label",
		header: "Status",
		enableGrouping: true,
	},
	{
		accessorKey: "order_type_label",
		header: "Tipo",
		enableGrouping: true,
	},
	{
		accessorKey: "client_name",
		header: "Cliente",
		enableGrouping: true,
	},
	{
		accessorKey: "product_name",
		header: "Produto",
		enableGrouping: true,
		aggregationFn: "count", // no grupo "por produto", mostra em quantos itens aparece
	},
	{
		accessorKey: "product_code",
		header: "Cód. Produto",
		enableGrouping: false,
	},
	{
		accessorKey: "quantity",
		header: "Quantidade",
		aggregationFn: "sum",
		cell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
		aggregatedCell: (info) => Number(info.getValue()).toLocaleString("pt-BR"),
	},
	{
		accessorKey: "item_total_value",
		header: "Valor Total",
		aggregationFn: "sum",
		cell: (info) => formatCurrency(Number(info.getValue())),
		aggregatedCell: (info) => formatCurrency(Number(info.getValue())),
	},
]

function formatCurrency(value: number) {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
