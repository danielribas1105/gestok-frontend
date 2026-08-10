import { useSalespersons } from "@/hooks/salesperson/use-salesperson"
import { Salesperson } from "@/schemas/Salesperson"
import SalespersonCard from "./salesperson-card"

export default function ListSalesperson() {
	const { data: salespersons = [], isLoading } = useSalespersons()

	if (isLoading) return <p>Carregando...</p>

	if (salespersons.length === 0) {
		return <div>Nenhum vendedor/gerente cadastrado!</div>
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{salespersons.map((salesperson: Salesperson) => (
				<SalespersonCard key={salesperson.id} salesperson={salesperson} />
			))}
		</div>
	)
}
