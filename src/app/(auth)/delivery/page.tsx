"use client"
import TitlePage from "@/components/layout/title-page"
import { DataTable } from "@/components/ui/data-table"
import { useDelivery } from "@/hooks/delivery/use-delivery"
import { DeliveryColumns } from "./components/delivery-columns"

export default function DeliveryPage() {
	const { data: delivery, isLoading } = useDelivery()

	console.log("delivery", delivery)
	return (
		<section className="flex flex-col gap-7">
			<TitlePage title="Entregas" placeholder="Buscar" />
			<div className="flex justify-center">
				<DataTable columns={DeliveryColumns} data={delivery ?? []} />
			</div>
			{/* <ClientModal open={open} onOpenChange={setOpen} /> */}
		</section>
	)
}
