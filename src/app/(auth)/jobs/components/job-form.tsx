"use client"

import { useState } from "react"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { useJobMutations } from "@/hooks/jobs/use-job-mutations"
import { useWorks } from "@/hooks/works/use-works"
import { useCars } from "@/hooks/cars/use-cars"
import { useUsers } from "@/hooks/users/use-users"
import { useStatements } from "@/hooks/statements/use-statements"
import { Job } from "@/schemas/job"

interface JobFormProps {
	job?: Job
	onSuccess?: () => void
}

export default function JobForm({ job, onSuccess }: JobFormProps) {
	const isEdit = !!job

	const { createJob, updateJob, deleteJob } = useJobMutations()

	const { data: works = [] } = useWorks()
	const { data: cars = [] } = useCars()
	const { data: users = [] } = useUsers()
	const { data: statements = [] } = useStatements()

	const drivers = users.filter((u) => u.profile === "driver")

	const [form, setForm] = useState({
		statement_id: job?.statement_id || "",
		origin: job?.origin || "",
		destiny: job?.destiny || "",
		car_id: job?.car_id || "",
		driver_id: job?.driver_id || "",
		status: job?.status || "pending",
	})

	// 🔥 remove origem da lista de destino
	const filteredDestinies = works.filter((w) => w.id !== form.origin)

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateJob.mutateAsync({
					id: job!.id,
					data: form,
				})
			} else {
				await createJob.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!job) return

		try {
			await deleteJob.mutateAsync(job.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createJob.isPending || updateJob.isPending || deleteJob.isPending

	// Define status options as an object
	const statusOptions = {
		pending: "Pending",
		in_progress: "In Progress",
		completed: "Completed",
		canceled: "Cancelled",
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* STATEMENT */}
			<Select
				value={form.statement_id}
				onValueChange={(v) => setForm({ ...form, statement_id: v })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Selecione o statement" />
				</SelectTrigger>
				<SelectContent>
					{statements.map((s) => (
						<SelectItem key={s.id} value={s.id}>
							{s.code}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* ORIGIN */}
			<Select
				value={form.origin}
				onValueChange={(v) =>
					setForm({
						...form,
						origin: v,
						destiny: v === form.destiny ? "" : form.destiny, // 🔥 evita conflito
					})
				}
			>
				<SelectTrigger>
					<SelectValue placeholder="Origem" />
				</SelectTrigger>
				<SelectContent>
					{works.map((w) => (
						<SelectItem key={w.id} value={w.id}>
							{w.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* DESTINY */}
			<Select
				value={form.destiny}
				onValueChange={(v) => setForm({ ...form, destiny: v })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Destino" />
				</SelectTrigger>
				<SelectContent>
					{filteredDestinies.map((w) => (
						<SelectItem key={w.id} value={w.id}>
							{w.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* CAR */}
			<Select
				value={form.car_id}
				onValueChange={(v) => setForm({ ...form, car_id: v })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Veículo" />
				</SelectTrigger>
				<SelectContent>
					{cars.map((c) => (
						<SelectItem key={c.id} value={c.id}>
							{c.model}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* DRIVER */}
			<Select
				value={form.driver_id}
				onValueChange={(v) => setForm({ ...form, driver_id: v })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Motorista" />
				</SelectTrigger>
				<SelectContent>
					{drivers.map((d) => (
						<SelectItem key={d.id} value={d.id}>
							{d.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* STATUS */}
			<Select
				value={form.status}
				onValueChange={(v) =>
					setForm({
						...form,
						status: v as "pending" | "in_progress" | "completed" | "canceled",
					})
				}
			>
				<SelectTrigger>
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(statusOptions).map(([key, value]) => (
						<SelectItem key={key} value={key}>
							{value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* ACTIONS */}
			<div className="flex justify-between items-center">
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Excluir</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Excluir job?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Confirmar
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				<Button type="submit" disabled={loading} className="ml-auto">
					{loading ? "Salvando..." : isEdit ? "Atualizar" : "Criar"}
				</Button>
			</div>
		</form>
	)
}
