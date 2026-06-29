"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Statement } from "@/schemas/statement"
import { useQuery } from "@tanstack/react-query"

export function useStatements() {
	return useQuery<Statement[]>({
		queryKey: ["statements"],
		queryFn: () => clientApi(routes.statements.list),
	})
}
