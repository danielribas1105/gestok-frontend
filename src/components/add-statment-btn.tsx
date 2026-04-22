"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"

export default function AddStatementButton() {
	const [open, setOpen] = useState(false)
	const handleAddStatement = () => {}

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="secondary"
						size="sm"
						disabled={false}
						onClick={() => setOpen(true)}
					>
						<Plus />
						Manifesto
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar novo manifesto</TooltipContent>
			</Tooltip>
			{/* <StatementModal open={open} onOpenChange={setOpen} /> */}
		</>
	)
}
