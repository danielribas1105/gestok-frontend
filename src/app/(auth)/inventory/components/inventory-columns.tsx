"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inventory } from "@/schemas/Inventory"

export const InventoryColumns: ColumnDef<Inventory>[] = [
	{
		accessorKey: "product_code",
		header: () => <div className="text-center">Código</div>,
		size: 150,
		cell: ({ row }) => {
			const product_code = row.getValue("product_code") ?? "Não cadastrado"
			return <div className="flex justify-center">{product_code as string}</div>
		},
	},
	{
		accessorKey: "product_name",
		header: () => <div className="text-left">Produto</div>,
		size: 350,
		cell: ({ row }) => {
			const product_name = row.getValue("product_name")
			return <div className="flex justify-left">{product_name as string}</div>
		},
	},
	{
		accessorKey: "current_quantity",
		header: () => <div className="text-center">Atual/Físico</div>,
		size: 120,
		cell: ({ row }) => {
			const current = Number(row.getValue("current_quantity")).toLocaleString(
				"pt-BR",
			)
			return <div className="flex justify-center">{current}</div>
		},
	},
	{
		accessorKey: "reserved_quantity",
		header: () => <div className="text-center">Reservado</div>,
		size: 120,
		cell: ({ row }) => {
			const reserved = Number(row.getValue("reserved_quantity")).toLocaleString(
				"pt-BR",
			)
			return <div className="flex justify-center">{reserved}</div>
		},
	},
	{
		accessorKey: "available_quantity",
		header: () => <div className="text-center">Disponível</div>,
		meta: { align: "center", color: "draft" },
		size: 120,
		cell: ({ row }) => {
			const available = Number(
				row.getValue("available_quantity"),
			).toLocaleString("pt-BR")
			return <div className="flex justify-center">{available}</div>
		},
	},
	{
		accessorKey: "last_updated",
		header: () => <div className="text-center">Última atualização</div>,
		size: 120,
		cell: ({ row }) => {
			const raw = row.getValue("last_updated") as string
			const date = new Date(raw)
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{date.toLocaleDateString("pt-BR")}
				</div>
			)
		},
	},
]
