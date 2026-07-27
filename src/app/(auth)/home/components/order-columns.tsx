"use client"
import { Order } from "@/schemas/Order"
import { ColumnDef } from "@tanstack/react-table"

export const OrderColumns: ColumnDef<Order>[] = [
	{
		accessorKey: "code",
		header: () => <div className="text-center">Pedido</div>,
		size: 90,
		cell: ({ row }) => {
			const code = row.getValue("code") as string
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{code}
				</div>
			)
		},
	},
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Emissão Pedido</div>,
		size: 90,
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
		accessorKey: "type",
		header: () => <div className="text-center">Operação</div>,
		size: 100,
		cell: ({ row }) => {
			const type = row.getValue("type") as string
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{type}
				</div>
			)
		},
	},
	{
		accessorKey: "material_name",
		header: () => <div className="text-center">Produto</div>,
		size: 170,
		cell: ({ row }) => {
			const value = row.getValue("material_name") as string
			return (
				<div
					className="text-[12px] text-center text-muted-foreground truncate"
					title={value}
				>
					{value}
				</div>
			)
		},
	},
	{
		accessorKey: "m3",
		header: () => <div className="text-center">Un. Medida</div>,
		size: 110,
		cell: ({ row }) => {
			const quantity = row.original.quantity as number
			const unit = row.original.unit === "m3" ? "m3" : row.original.unit
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{`${quantity.toFixed(2)} (${unit})`}
				</div>
			)
		},
	},
	{
		id: "payment_value",
		header: () => <div className="text-center">Quantidade</div>,
		size: 110,
		cell: ({ row }) => {
			const value = row.original.value as number
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{value.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</div>
			)
		},
	},
	{
		accessorKey: "origin_name",
		header: () => <div className="text-center">Valor</div>,
		size: 200,
		cell: ({ row }) => {
			const value = row.getValue("origin_name") as string
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{value}
				</div>
			)
		},
	},
	{
		accessorKey: "destiny_name",
		header: () => <div className="text-center">Cliente</div>,
		size: 200,
		cell: ({ row }) => {
			const value = row.getValue("destiny_name") as string
			return (
				<div
					className="text-[12px] text-center text-muted-foreground truncate"
					title={value}
				>
					{value}
				</div>
			)
		},
	},
	{
		accessorKey: "car_license",
		header: () => <div className="text-center">Cod. Cliente</div>,
		size: 80,
		cell: ({ row }) => {
			const value = row.getValue("car_license") as string
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{value}
				</div>
			)
		},
	},
	{
		accessorKey: "creator_name",
		header: () => <div className="text-center">Criado por</div>,
		size: 90,
		cell: ({ row }) => {
			const value = row.getValue("creator_name") as string
			return (
				<div
					className="text-[12px] text-center text-muted-foreground truncate"
					title={value}
				>
					{value}
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
]
