import { Clock, DollarSign, Package, ShoppingCart } from "lucide-react"
import SummaryCard from "./summary-card"

export interface OrdersSummary {
	totalOrders: number
	totalItems: number
	totalProducts: number
	totalValue: number
	pendingOrders: number
	processedOrders: number
	canceledOrders: number
}

interface SummaryWrapperProps {
	summary: OrdersSummary
	isLoading?: boolean
}

export default function SummaryWrapper({
	summary,
	isLoading,
}: SummaryWrapperProps) {
	const formattedValue = summary.totalValue.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	})

	return (
		<div className="flex flex-col md:flex-row gap-2 items-center justify-around">
			<SummaryCard title="Total de Pedidos" icon={Package}>
				<div className="text-2xl font-bold">
					{isLoading ? "-" : summary.totalOrders}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					{isLoading ? "carregando..." : `${summary.totalItems} itens no total`}
				</p>
			</SummaryCard>
			<SummaryCard title="Valor Total" icon={DollarSign}>
				<div className="text-2xl font-bold">
					{isLoading ? "-" : formattedValue}
				</div>
				<p className="text-xs text-muted-foreground mt-1">Todos os pedidos</p>
			</SummaryCard>
			<SummaryCard title="Pendentes" icon={Clock}>
				<div className="text-2xl font-bold text-yellow-600">
					{isLoading ? "-" : summary.pendingOrders}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					Aguardando processamento
				</p>
			</SummaryCard>
			<SummaryCard title="Processados" icon={ShoppingCart}>
				<div className="text-2xl font-bold text-green-600">
					{isLoading ? "-" : summary.processedOrders}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					{isLoading ? "-" : `${summary.canceledOrders} cancelados`}
				</p>
			</SummaryCard>
		</div>
	)
}
