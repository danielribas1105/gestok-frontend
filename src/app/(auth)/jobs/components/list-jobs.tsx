import { useJobs } from "@/hooks/jobs/use-jobs"
import { Job } from "@/schemas/job"
import JobCard from "./job-card"

export default function ListJobs() {
	const { data: jobs = [], isLoading } = useJobs()

	if (isLoading) return <p>Carregando...</p>

	if (jobs.length === 0) {
		return <div>Nenhum transporte encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{jobs && jobs.map((job: Job) => <JobCard key={job.id} job={job} />)}
		</div>
	)
}
