"use client"

import { Product } from "@/schemas/Product"
import { ColumnDef } from "@tanstack/react-table"

export const ProductsColumns: ColumnDef<Product>[] = [
	{
		accessorKey: "code",
		header: () => <div className="text-center">Código</div>,
		size: 150,
		cell: ({ row }) => {
			const code = row.getValue("code") ?? "Não cadastrado"
			return <div className="flex justify-center">{code as string}</div>
		},
	},
	{
		accessorKey: "name",
		header: () => <div className="text-left">Produto</div>,
		size: 350,
		cell: ({ row }) => {
			const name = row.getValue("name")
			return <div className="flex justify-left">{name as string}</div>
		},
	},
	{
		accessorKey: "unit",
		header: () => <div className="text-center">Unidade</div>,
		size: 60,
		cell: ({ row }) => {
			const unit = row.getValue("unit")
			return <div className="flex justify-center">{unit as string}</div>
		},
	},
	{
		accessorKey: "volume_m3_per_unit",
		header: () => <div className="text-center">Volume (m3)</div>,
		size: 120,
		cell: ({ row }) => {
			const volume = Number(row.getValue("volume_m3_per_unit"))
			return <div className="flex justify-center">{volume}</div>
		},
	},
	{
		accessorKey: "weight_kg_per_unit",
		header: () => <div className="text-center">Peso (Kg)</div>,
		size: 120,
		cell: ({ row }) => {
			const weight = Number(row.getValue("weight_kg_per_unit"))
			return <div className="flex justify-center">{weight}</div>
		},
	},
	{
		accessorKey: "boxes_per_pallet",
		header: () => <div className="text-center">Caixas/Pallet</div>,
		size: 120,
		cell: ({ row }) => {
			const boxes = Number(row.getValue("boxes_per_pallet"))
			return <div className="flex justify-center">{boxes}</div>
		},
	},
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Criado em</div>,
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
]
