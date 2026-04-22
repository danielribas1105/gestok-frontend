import { Circle } from "lucide-react"
import { Job } from "@/schemas/job"
import { useState } from "react"
import JobModal from "./job-modal"

export interface JobCardProps {
	job: Job
}

export default function JobCard({ job }: JobCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do job ${job.id}`}
			>
				<div className="flex flex-col gap-1">
					<header>
						<h2>Job {job.id}</h2>
					</header>
					<dl>
						<dt>Origem</dt>
						<dd>{job.origin_id}</dd>
						<dt>Destino</dt>
						<dd>{job.destiny_id}</dd>
					</dl>
					<footer className="flex items-center gap-1">
						<Circle
							size={16}
							color={job.status ? "#00FF00" : "#FF0000"}
							aria-hidden="true"
						/>
						<span className="text-sm uppercase">
							{job.status ? "Ativo" : "Inativo"}
						</span>
					</footer>
				</div>
			</article>
			<JobModal open={open} onOpenChange={setOpen} job={job} />
		</>
	)
}
