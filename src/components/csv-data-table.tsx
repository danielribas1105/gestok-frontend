"use client"
import * as React from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { SortingState, HeaderContext } from "@tanstack/react-table"

interface CSVDataTableProps {
	data: any[]
	columns: string[]
}

export default function CSVDataTable({ data, columns }: CSVDataTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = React.useState("")

	const tableColumns = React.useMemo<ColumnDef<any>[]>(
		() => [
			{
				id: "index",
				header: "#",
				cell: ({ row }) => row.index + 1,
			},
			...columns.map((col) => ({
				accessorKey: col,
				header: ({ column }: HeaderContext<any, unknown>) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-left text-zinc-200 hover:text-blue-800"
					>
						{col}
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: (info: any) => info.getValue() ?? "-",
			})),
		],
		[columns],
	)

	const table = useReactTable({
		data,
		columns: tableColumns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	})

	return (
		<div className="flex flex-col gap-4 mt-4">
			{/* 🔍 Filtro global */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<Input
					placeholder="Filtrar..."
					value={globalFilter ?? ""}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-xs bg-white border-blue-800 text-blue-800 placeholder:text-zinc-400"
				/>
				<div className="text-sm text-blue-800">
					{table.getFilteredRowModel().rows.length} de {data.length} registros
				</div>
			</div>

			{/* 🧾 Tabela */}
			<div className="rounded-xl border border-blue-800 shadow-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-blue-800">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="text-left font-semibold text-zinc-200"
									>
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="hover:bg-blue-800/20 transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-blue-800">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length + 1}
									className="h-24 text-center text-blue-800"
								>
									Nenhum dado encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* 🔄 Paginação */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-2 text-sm text-blue-800">
					<span>Página</span>
					<strong className="text-blue-700">
						{table.getState().pagination.pageIndex + 1} de{" "}
						{table.getPageCount()}
					</strong>
				</div>

				<div className="flex items-center gap-3">
					<Select
						value={String(table.getState().pagination.pageSize)}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="w-27.5 bg-white border-blue-800 text-blue-800">
							<SelectValue placeholder="Tamanho" />
						</SelectTrigger>
						<SelectContent className="bg-white text-blue-800 border-blue-800">
							{[10, 25, 50, 100].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size} / pág
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className="text-blue-800"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className="text-blue-800"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
