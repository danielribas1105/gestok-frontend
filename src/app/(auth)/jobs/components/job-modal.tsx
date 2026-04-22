"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Job } from "@/schemas/job"
import JobForm from "./job-form"

interface JobModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	job?: Job
}

export default function JobModal({ open, onOpenChange, job }: JobModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={job ? "Excluir/Editar transporte" : "Adicionar transporte"}
			description={
				job
					? "Exclua ou edite as informações do transporte"
					: "Preencha as informações do novo transporte e clique em salvar"
			}
		>
			<JobForm job={job} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}
