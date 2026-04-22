"use client"
import { Plus } from "lucide-react"
import { usePermissions } from "@/hooks/auth/use-permissions"
import { Button } from "../ui/button"
import Search from "../ui/search"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface TitlePageProps {
	title: string
	className?: string
	placeholder?: string
	textButton?: string
	textTooltip?: string
	onAdd?: () => void
}

export default function TitlePage({
	title,
	className,
	placeholder,
	textButton,
	textTooltip,
	onAdd,
}: TitlePageProps) {
	const { isAdmin } = usePermissions()

	console.warn("TitlePage renderizado", { title, isAdmin })
	return (
		<div
			className={`${className ?? ""} flex justify-between items-center gap-3`}
		>
			<div className="flex flex-1/3 gap-3 items-center">
				<h1 className="text-3xl text-logo-blue-dark font-logo font-bold">
					{title}
				</h1>
				<Tooltip>
					<TooltipTrigger asChild>
						{isAdmin && (
							<Button variant="default" className="flex gap-2" onClick={onAdd}>
								<Plus />
							</Button>
						)}
					</TooltipTrigger>
					<TooltipContent>
						<p>{textTooltip}</p>
					</TooltipContent>
				</Tooltip>
			</div>
			{placeholder && <Search className="flex-1" placeholder={placeholder} />}
		</div>
	)
}
