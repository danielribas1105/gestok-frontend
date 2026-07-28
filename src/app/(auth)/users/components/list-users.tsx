import { useUsers } from "@/hooks/users/use-users"
import { User } from "@/schemas/User"
import UserCard from "./user-card"

export default function ListUsers() {
	const { data: users = [], isLoading, isError, error } = useUsers()

	if (isLoading) return <p>Carregando...</p>

	if (isError) {
		return (
			<div className="text-red-600">
				Erro ao carregar motoristas:{" "}
				{error instanceof Error ? error.message : "Erro desconhecido"}
			</div>
		)
	}

	if (users.length === 0) {
		return <div>Nenhum usuário cadastrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{users.map((user: User) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	)
}
