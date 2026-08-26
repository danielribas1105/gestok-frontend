"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DeliveryReadPayload } from "@/types/Delivery"

/**
 * Colunas usadas pela MESMA tabela nas 3 visões. O que muda entre
 * "flat", "por pedido" e "por produto" não é a definição de colunas,
 * e sim o estado `grouping` passado ao useReactTable (ver orders-explorer.tsx).
 *
 * Colunas numéricas têm `aggregationFn` definido, para que quando o
 * TanStack Table agrupar linhas ele saiba somar quantidade e valor
 * automaticamente nas linhas de grupo.
 */
export const DeliveryColumns: ColumnDef<DeliveryReadPayload>[] = [
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Lançamento</div>,
		size: 120,
		cell: ({ row }) => {
			const raw = row.getValue("created_at") as string
			const date = new Date(raw)
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{date.toLocaleDateString("pt-BR")}
				</div>
			)
		},
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
		accessorKey: "order_code",
		header: () => <div className="text-center">Pedido</div>,
		size: 200,
		cell: ({ row }) => {
			const order_code = row.getValue("order_code") ?? "Não cadastrado"
			return <div className="flex justify-center">{order_code as string}</div>
		},
	},
	{
		accessorKey: "car",
		header: () => <div className="text-center">Veículo</div>,
		size: 400,
		cell: ({ row }) => {
			const car = row.getValue("car")
			return <div className="flex justify-center">{car as string}</div>
		},
	},
	{
		accessorKey: "driver",
		header: () => <div className="text-center">Motorista</div>,
		size: 400,
		cell: ({ row }) => {
			const driver = row.getValue("driver")
			return <div className="flex justify-center">{driver as string}</div>
		},
	},
	{
		accessorKey: "weight",
		header: () => <div className="text-center">Peso total (Kg)</div>,
		size: 120,
		cell: ({ row }) => {
			const weight = Number(row.getValue("weight")).toLocaleString("pt-BR")
			return <div className="flex justify-center">{weight}</div>
		},
	},
	{
		accessorKey: "invoice",
		header: () => <div className="text-center">NF</div>,
		size: 400,
		cell: ({ row }) => {
			const invoice = row.getValue("invoice")
			return <div className="flex justify-center">{invoice as string}</div>
		},
	},
	{
		accessorKey: "delivery_at",
		header: () => <div className="text-center">Agendamento</div>,
		size: 120,
		cell: ({ row }) => {
			const raw = row.getValue("delivery_at") as string
			const date = new Date(raw)
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{date.toLocaleDateString("pt-BR")}
				</div>
			)
		},
	},
	{
		accessorKey: "departed_at",
		header: () => <div className="text-center">Saída em</div>,
		size: 120,
		cell: ({ row }) => {
			const raw = (row.getValue("departed_at") as string) ?? ""
			const date = new Date(raw)
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{raw ? date.toLocaleDateString("pt-BR") : "-"}
				</div>
			)
		},
	},
	{
		accessorKey: "delivery_confirmed",
		header: () => <div className="text-center">Entregue</div>,
		size: 120,
		cell: ({ row }) => {
			const raw = row.getValue("delivery_confirmed") as boolean
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{raw ? "OK" : "-"}
				</div>
			)
		},
	},
	{
		accessorKey: "user",
		header: () => <div className="text-center">Criado por</div>,
		size: 400,
		cell: ({ row }) => {
			const user = row.getValue("user")
			return <div className="flex justify-center">{user as string}</div>
		},
	},
]
