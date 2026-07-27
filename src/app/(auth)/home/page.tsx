"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/hooks/auth/use-session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { OrdersPivotTable } from "./components/orders-pivot-table"
import { OrdersTable } from "./components/orders-table"
import CSVDataTable from "@/components/csv-data-table"
import { UploadFileModal } from "@/components/upload-file-modal"
import TitlePage from "@/components/layout/title-page"
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react"
import SummaryWrapper from "./components/summary-wrapper"
import { OrderStatusLegend } from "./components/order-status-legend"
import { DataTable } from "@/components/ui/data-table"
import { orderColumns } from "@tanstack/react-table"
import { OrderColumns } from "./components/order-columns"

// Main screen - list of orders
export default function HomePage() {
	const { user, loading } = useSession()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [status, setStatus] = useState<{
		status: "checking" | "online" | "offline"
		timestamp: string
	}>({
		status: "checking",
		timestamp: "",
	})

	const [tableData, setTableData] = useState<{
		data: any[]
		columns: string[]
	}>({
		data: [],
		columns: [],
	})

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login")
		}
	}, [loading, user])

	useEffect(() => {
		async function fetchStatus() {
			try {
				setStatus((prev) => ({ ...prev, status: "checking" }))
				const res = await fetch("http://localhost:8000/status")
				const data = await res.json()
				setStatus({
					status: data.status_API === "online" ? "online" : "offline",
					timestamp: data.timestamp || new Date().toISOString(),
				})
			} catch {
				setStatus({
					status: "offline",
					timestamp: new Date().toISOString(),
				})
			}
		}

		fetchStatus()
		const interval = setInterval(fetchStatus, 60000)
		return () => clearInterval(interval)
	}, [])

	const renderStatusIcon = () => {
		switch (status.status) {
			case "checking":
				return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
			case "online":
				return <CheckCircle className="h-5 w-5 text-green-500" />
			case "offline":
				return <XCircle className="h-5 w-5 text-red-500" />
			default:
				return <Circle className="h-5 w-5 text-gray-400" />
		}
	}

	if (loading) {
		return (
			<section className="flex flex-col gap-1">
				<div className="flex justify-end">
					<Skeleton className="h-6 w-32 rounded-md" />
				</div>
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-7">
			<div className="flex flex-col items-start text-xl mb-4">
				<div className="flex items-center gap-2">
					<span>Status:</span>
					{renderStatusIcon()}
					<span
						className={
							status.status === "online"
								? "text-green-500"
								: status.status === "checking"
									? "text-yellow-500"
									: "text-red-500"
						}
					>
						{status.status === "checking" ? "verificando..." : status.status}
					</span>
				</div>
				<div className="text-sm text-gray-400">
					Última atualização:{" "}
					{status.timestamp
						? new Date(status.timestamp).toLocaleTimeString()
						: "-"}
				</div>
			</div>
			<SummaryWrapper />
			<div className="flex flex-col gap-1">
				<div className="md:hidden flex justify-center">
					<p className="text-2xl font-semibold">Movimentações</p>
				</div>
				<div className="hidden md:flex justify-end">
					<OrderStatusLegend />
				</div>

				{/* Desktop: tabela normal */}
				<div className="hidden md:block">
					<DataTable
						columns={OrderColumns}
						data={tableData.data}
						/* onRowClick={(job) => setSelectedJob(job)} */
					/>
				</div>

				{/* Mobile: cards */}
				{/* <div className="md:hidden">
					<ListJobsHome jobs={jobs} onJobClick={(job) => setSelectedJob(job)} />
				</div> */}
			</div>

			{/* Tabs para alternar entre visões */}
			{/* <Tabs defaultValue="pivot" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="pivot">Visão por Pedido</TabsTrigger>
					<TabsTrigger value="items">Visão por Produto</TabsTrigger>
				</TabsList>

				<TabsContent value="pivot" className="mt-6">
					<OrdersPivotTable />
				</TabsContent>

				<TabsContent value="items" className="mt-6">
					<OrdersTable />
				</TabsContent>
			</Tabs> */}

			{tableData.data.length > 0 && (
				<div className="mt-6">
					<CSVDataTable data={tableData.data} columns={tableData.columns} />
				</div>
			)}
		</section>
	)
}
