import z from "zod"

export const JobStatusEnum = z.enum([
	"pending",
	"in_progress",
	"completed",
	"canceled",
])

export const JobSchema = z.object({
	id: z.uuid(),
	statement_id: z.uuid(),
	origin: z.uuid(),
	destiny: z.uuid(),
	car_id: z.uuid(),
	driver_id: z.uuid(),
	created_by: z.uuid(),
	status: JobStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	value_m3: z.number(),
	m3: z.number(),
	origin_name: z.string(),
	destiny_name: z.string(),
	car_license: z.string(),
	driver_name: z.string(),
	creator_name: z.string(),
})

export type Job = z.infer<typeof JobSchema>
