import { useWorks } from "@/hooks/works/use-works"
import { Work } from "@/schemas/work"
import WorkCard from "./work-card"

export default function ListWorks() {
	const { data: works = [], isLoading } = useWorks()

	if (isLoading) return <p>Carregando...</p>

	if (works.length === 0) {
		return <div>Nenhuma obra encontrada!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{works &&
				works.map((work: Work) => <WorkCard key={work.id} work={work} />)}
		</div>
	)
}
