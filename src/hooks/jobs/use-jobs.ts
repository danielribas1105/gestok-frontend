"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job } from "@/schemas/job"
import { useQuery } from "@tanstack/react-query"

export function useJobs() {
	return useQuery<Job[]>({
		queryKey: ["jobs"],
		queryFn: () => clientApi(routes.jobs.list),
	})
}
