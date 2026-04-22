import { Statement } from "@/schemas/statement"
import { useStatements } from "@/hooks/statements/use-statements"
import StatementCard from "./statement-card"

export default function ListStatements() {
	const { data: statements = [], isLoading } = useStatements()

	if (isLoading) return <p>Carregando...</p>

	if (statements.length === 0) {
		return <div>Nenhum manifesto encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{statements &&
				statements.map((statement: Statement) => (
					<StatementCard key={statement.id} statement={statement} />
				))}
		</div>
	)
}
