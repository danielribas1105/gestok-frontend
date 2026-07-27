import { Clock, DollarSign, Package, ShoppingCart } from "lucide-react"
import SummaryCard from "./summary-card"

export default function SummaryWrapper() {
	/* const { data: statementsSum } = useStatementsCount()
	const { data: paymentsSum } = usePaymentsSum()
	const { data: jobsCount } = useJobsCount() */

	/* const statementsChartData = statementsSum
		? ToChartData(statementsSum, COLORS_STATUS_MAP)
		: []
	const paymentsChartData = paymentsSum
		? ToChartData(paymentsSum, PAYMENTS_STATUS_MAP)
		: []
	const jobsChartData = jobsCount
		? ToChartData(jobsCount, COLORS_STATUS_MAP)
		: [] */

	return (
		<div className="flex flex-col md:flex-row gap-2 items-center justify-around">
			<SummaryCard title="Total de Pedidos" icon={Package}>
				<div className="text-2xl font-bold">3</div>
				<p className="text-xs text-muted-foreground mt-1">6 itens no total</p>
			</SummaryCard>
			<SummaryCard title="Valor Total" icon={DollarSign}>
				<div className="text-2xl font-bold">R$ 801,00</div>
				<p className="text-xs text-muted-foreground mt-1">Todos os pedidos</p>
			</SummaryCard>
			<SummaryCard title="Pendentes" icon={Clock}>
				<div className="text-2xl font-bold text-yellow-600">3</div>
				<p className="text-xs text-muted-foreground mt-1">
					Aguardando processamento
				</p>
			</SummaryCard>
			<SummaryCard title="Processados" icon={ShoppingCart}>
				<div className="text-2xl font-bold text-green-600">0</div>
				<p className="text-xs text-muted-foreground mt-1">0 cancelados</p>
			</SummaryCard>
		</div>
	)
}
