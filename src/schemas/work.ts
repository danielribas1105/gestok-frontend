import { z } from "zod"

export const WorkStatusEnum = z.enum([
	"active",
	"inactive",
	"paralyzed",
	"finished",
])

export const WorkSchema = z.object({
	id: z.uuid(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	description: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	address: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	region: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	city: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	state: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	active: z.boolean().optional(),
	status: WorkStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
})

export type Work = z.infer<typeof WorkSchema>
