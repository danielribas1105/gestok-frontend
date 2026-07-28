import { useDrivers } from "@/hooks/drivers/use-drivers"
import { Driver } from "@/schemas/Driver"
import DriverCard from "./driver-card"

export default function ListDrivers() {
	const { data: drivers = [], isLoading, isError, error } = useDrivers()

	if (isLoading) return <p>Carregando...</p>

	if (isError) {
		return (
			<div className="text-red-600">
				Erro ao carregar motoristas:{" "}
				{error instanceof Error ? error.message : "Erro desconhecido"}
			</div>
		)
	}

	if (drivers.length === 0) {
		return <div>Nenhum motorista cadastrado!</div>
	}
	console.log("drivers", drivers)

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{drivers.map((driver: Driver) => (
				<DriverCard key={driver.id} driver={driver} />
			))}
		</div>
	)
}
