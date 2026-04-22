"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import JobModal from "@/app/(auth)/jobs/components/job-modal"

export default function AddJobButton() {
	const [open, setOpen] = useState(false)

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
						Movimentação
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar nova movimentação</TooltipContent>
			</Tooltip>
			<JobModal open={open} onOpenChange={setOpen} />
		</>
	)
}
