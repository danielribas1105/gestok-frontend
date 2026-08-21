"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/hooks/auth/use-session"
import { useOrdersViews } from "@/hooks/orders/use-orders-views"
import {
	AlertTriangle,
	CheckCircle,
	Circle,
	Loader2,
	XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { OrdersExplorer } from "./components/orders-explorer"
import SummaryWrapper from "./components/summary-wrapper"
import { useProductsQuantityCheck } from "@/hooks/orders/use-products-quantity-check"
import { useOrderMutations } from "@/hooks/orders/use-order-mutations"

// Main screen - list of orders
export default function HomePage() {
	const { user, loading } = useSession()
	const { setStockHold } = useOrderMutations()

	const handleToggleHold = (orderId: string, nextValue: boolean) => {
		setStockHold.mutate({ orderId, stockHold: nextValue })
	}

	// só há um order_id "em voo" por vez, já que é a mesma mutation
	// compartilhada por todos os checkboxes da tabela
	const pendingHoldOrderId = setStockHold.isPending
		? (setStockHold.variables?.orderId ?? null)
		: null

	const router = useRouter()
	const {
		flatRows,
		summary,
		byOrder,
		isLoading: isLoadingOrders,
	} = useOrdersViews()

	// ids dos pedidos selecionados na tabela (vem do OrdersExplorer)
	/* const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
	const { data: stockCheck, isFetching: isCheckingStock } =
		useProductsQuantityCheck(selectedOrderIds) */

	const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

	const { data: stockCheck, isFetching: isCheckingStock } =
		useProductsQuantityCheck(selectedItemIds)

	const stockByProduct = useMemo(() => {
		if (!stockCheck) return undefined
		return Object.fromEntries(
			stockCheck.items.map((item) => [item.product_id, item]),
		)
	}, [stockCheck])

	const [status, setStatus] = useState<{
		status: "checking" | "online" | "offline"
		timestamp: string
	}>({
		status: "checking",
		timestamp: "",
	})

	console.log("flatRows", flatRows)
	console.log("summary", summary)
	console.log("stockCheck", stockCheck)

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
			<OrdersExplorer
				rows={flatRows}
				isLoading={isLoadingOrders}
				stockByProduct={stockByProduct}
				isCheckingStock={isCheckingStock}
				userRole={user?.role}
				pendingHoldOrderId={pendingHoldOrderId}
				onToggleHold={handleToggleHold}
				onSelectionChange={({ itemIds }) => setSelectedItemIds(itemIds)}
			/>

			{selectedItemIds.length > 0 && (
				<div className="rounded-md border p-3 text-sm">
					{isCheckingStock && (
						<span className="text-gray-400">Verificando estoque...</span>
					)}
					{stockCheck && !isCheckingStock && (
						<div className="flex flex-col gap-1">
							{!stockCheck.all_sufficient && (
								<div className="flex items-center gap-1 text-amber-600 font-medium">
									<AlertTriangle className="h-4 w-4" />
									Estoque insuficiente para{" "}
									{stockCheck.items.filter((i) => !i.is_sufficient).length}{" "}
									produto(s)
								</div>
							)}
							{stockCheck.items
								.filter((i) => !i.is_sufficient)
								.map((item) => (
									<div key={item.product_id} className="text-gray-600">
										{item.name}: pedido {item.total_quantity} / disponível{" "}
										{item.available_quantity}
									</div>
								))}
						</div>
					)}
				</div>
			)}
		</section>
	)
}
