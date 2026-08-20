"use client"
import InventoryModal from "@/app/(auth)/inventory/components/inventory-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export default function AddStockButton() {
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
						Estoque
					</Button>
				</TooltipTrigger>
				<TooltipContent>Entrada de produtos</TooltipContent>
			</Tooltip>
			<InventoryModal open={open} onOpenChange={setOpen} />
		</>
	)
}
