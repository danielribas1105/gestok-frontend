"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/auth/use-session"
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { OrdersExplorer } from "./components/orders-explorer"
import { OrderStatusLegend } from "./components/order-status-legend"
import SummaryWrapper from "./components/summary-wrapper"
import { useOrdersViews } from "@/hooks/orders/use-orders-views"

// Main screen - list of orders
export default function HomePage() {
	const { user, loading } = useSession()
	const router = useRouter()
	const { flatRows, summary, isLoading: isLoadingOrders } = useOrdersViews()
	const [status, setStatus] = useState<{
		status: "checking" | "online" | "offline"
		timestamp: string
	}>({
		status: "checking",
		timestamp: "",
	})

	console.log("flatRows", flatRows)
	console.log("summary", summary)

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login")
		}
	}, [loading, user])

	useEffect(() => {
		async function fetchStatus() {
			try {
				setStatus((prev) => ({ ...prev, status: "checking" }))
				const res = await fetch("http://localhost:8000/status") //${process.env.NEXT_PUBLIC_API_URL}
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
			<SummaryWrapper summary={summary} isLoading={isLoadingOrders} />
			<OrdersExplorer rows={flatRows} isLoading={isLoadingOrders} />
		</section>
	)
}
