import { useCars } from "@/hooks/cars/use-cars"
import { Car } from "@/schemas/Car"
import CarCard from "./car-card"

export default function ListCars() {
	const { data: cars = [], isLoading } = useCars()

	if (isLoading) return <p>Carregando...</p>

	if (cars.length === 0) {
		return <div>Nenhum veículo cadastrado!</div>
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{cars.map((car: Car) => (
				<CarCard key={car.id} car={car} />
			))}
		</div>
	)
}
