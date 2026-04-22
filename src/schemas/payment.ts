import z from "zod"

export const PaymentStatusEnum = z.enum(["pending", "paid", "canceled"])

export const PaymentSchema = z.object({
	id: z.uuid(),
	job_id: z.uuid(),
	m3: z.number().positive("A quantidade de m3 deve ser um número positivo"),
	value_m3: z.number().positive("O valor por m3 deve ser um número positivo"),
	total_value: z.number().positive("O valor total deve ser um número positivo"),
	status: PaymentStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

export type Payment = z.infer<typeof PaymentSchema>
