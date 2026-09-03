"use client"
import TitlePage from "@/components/layout/title-page"
import { DataTable } from "@/components/ui/data-table"
import { useDelivery } from "@/hooks/delivery/use-delivery"
import { DeliveryColumns } from "./components/delivery-columns"
import { DeliveryStatusLegend } from "./components/delivery-status-legend"
import { useState } from "react"
import { DeliveryReadPayload } from "@/types/Delivery"
import DeliveryModal from "./components/delivery-modal"

export default function DeliveryPage() {
	const { data: deliveries } = useDelivery()
	const [selectedDelivery, setSelectedDelivery] = useState<
		DeliveryReadPayload | undefined
	>(undefined)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage title="Entregas" placeholder="Buscar" />
			<div className="flex flex-col justify-center">
				<div className="hidden md:flex justify-end">
					<DeliveryStatusLegend />
				</div>
				<DataTable
					columns={DeliveryColumns}
					data={deliveries ?? []}
					onRowClick={(delivery) => setSelectedDelivery(delivery)}
				/>
			</div>
			<DeliveryModal
				open={!!selectedDelivery}
				delivery={selectedDelivery}
				onOpenChange={(v) => {
					if (!v) setSelectedDelivery(undefined)
				}}
			/>
		</section>
	)
}
