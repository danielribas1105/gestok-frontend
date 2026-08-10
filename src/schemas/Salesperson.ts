import { z } from "zod"

export const SalespersonProfileEnum = z.enum([
	"seller",
	"supervisor",
	"manager",
])

export const SalespersonSchema = z.object({
	id: z.uuid(),
	code: z.string(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	trade_name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	phone: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	profile: SalespersonProfileEnum,
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
})

export type Salesperson = z.infer<typeof SalespersonSchema>
