"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Job } from "@/schemas/job"

export const JobColumns: ColumnDef<Job>[] = [
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Data</div>,
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
		accessorKey: "statement_code",
		header: () => <div className="text-center">Manifesto</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("statement_code")}
				</div>
			)
		},
	},
	{
		accessorKey: "material_name",
		header: () => <div className="text-center">Material</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("material_name")}
				</div>
			)
		},
	},
	{
		accessorKey: "m3",
		header: () => <div className="text-center">M3</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("m3")}
				</div>
			)
		},
	},
	{
		id: "value_m3",
		header: () => <div className="text-center">À pagar</div>,
		cell: ({ row }) => {
			const m3 = row.original.m3 as number
			const value_m3 = row.original.value_m3 as number
			const total = m3 * value_m3

			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{total.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</div>
			)
		},
	},
	{
		accessorKey: "origin_name",
		header: () => <div className="text-center">Origem</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("origin_name")}
				</div>
			)
		},
	},
	{
		accessorKey: "destiny_name",
		header: () => <div className="text-center">Destino</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("destiny_name")}
				</div>
			)
		},
	},
	{
		accessorKey: "car_license",
		header: () => <div className="text-center">Veículo</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("car_license")}
				</div>
			)
		},
	},
	{
		accessorKey: "driver_name",
		header: () => <div className="text-center">Motorista</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("driver_name")}
				</div>
			)
		},
	},
	{
		accessorKey: "creator_name",
		header: () => <div className="text-center">Criado por</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("creator_name")}
				</div>
			)
		},
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Status</div>,
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			const statusColors: Record<string, string> = {
				in_progress: "bg-blue-500",
				completed: "bg-green-500",
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
