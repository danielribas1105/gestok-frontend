"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { logout } from "@/lib/auth"

export default function LogoutButton() {
	const handleLogout = () => {
		if (confirm("Deseja realmente sair?")) {
			logout()
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					disabled={false}
					onClick={handleLogout}
				>
					<LogOut />
					Sair
				</Button>
			</TooltipTrigger>
			<TooltipContent>Sair da conta</TooltipContent>
		</Tooltip>
	)
}
