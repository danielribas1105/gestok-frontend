"use client"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"
import { useState } from "react"
import VehicleMapModal from "@/components/maps/vehicle-map-modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export default function OpenMapsButton() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="secondary" onClick={() => setOpen(true)}>
						<Map />
						<span className="hidden md:block">Mapa</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Localizar veículos</TooltipContent>
			</Tooltip>
			<VehicleMapModal open={open} onOpenChange={setOpen} />
		</>
	)
}
