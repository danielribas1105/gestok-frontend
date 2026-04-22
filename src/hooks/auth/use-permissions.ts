import { useSession } from "./use-session"

export function usePermissions() {
	const { user } = useSession()

	return {
		isAdmin: user?.role === "admin",
	}
}
