"use client"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { useSession } from "@/hooks/auth/use-session"
import { useEffect } from "react"
import { JobColumns } from "./components/job-columns"
import { JobStatusLegend } from "./components/job-status-legend"
import { Skeleton } from "@/components/ui/skeleton"
import { useJobs } from "@/hooks/jobs/use-jobs"

export default function HomePage() {
	const { user, loading } = useSession()
	const router = useRouter()
	const { data: jobs = [], isLoading } = useJobs()

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login")
		}
	}, [loading, user])

	console.log("jobs", jobs)

	if (loading) {
		return (
			<section className="flex flex-col gap-1">
				<div className="flex justify-end">
					<Skeleton className="h-6 w-32 rounded-md" />
				</div>
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-1">
			<div className="flex justify-end">
				<JobStatusLegend />
			</div>
			<DataTable columns={JobColumns} data={jobs} />
		</section>
	)
}
