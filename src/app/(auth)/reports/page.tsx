import TitlePage from "@/components/ui/title-page"

import ColumnsChart from "./components/columns-chart"

export default function ReportsPage() {
	return (
		<section>
			<div className="flex flex-col gap-5">
				<TitlePage title="Relatórios" />
				<div className="grid grid-cols-3 gap-5">
					<ColumnsChart />
					<ColumnsChart />
					<ColumnsChart />
				</div>
			</div>
		</section>
	)
}
