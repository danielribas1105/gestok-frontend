import { useClients } from "@/hooks/clients/use-clients"
import { Client } from "@/schemas/Client"
import ClientCard from "./client-card"

export default function ListClients() {
	const { data: clients = [], isLoading } = useClients()

	if (isLoading) return <p>Carregando...</p>

	if (clients.length === 0) {
		return <div>Nenhum cliente cadastrado!</div>
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{clients.map((client: Client) => (
				<ClientCard key={client.id} client={client} />
			))}
		</div>
	)
}
