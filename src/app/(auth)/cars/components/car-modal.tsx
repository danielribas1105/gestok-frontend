"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Car } from "@/schemas/car"
import CarForm from "./car-form"

interface CarModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	car?: Car
}

export default function CarModal({ open, onOpenChange, car }: CarModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={car ? "Editar veículo" : "Adicionar veículo"}
			description={
				car
					? "Edite as informações do veículo e clique em salvar"
					: "Preencha as informações do novo veículo e clique em salvar"
			}
		>
			<CarForm car={car} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
