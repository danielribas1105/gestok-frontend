import { z } from "zod"

export const CarFuelEnum = z.enum([
	"diesel",
	"gasoline",
	"ethanol",
	"electric",
	"gnv",
	"hybrid",
])

export const CarSchema = z.object({
	id: z.uuid(),
	model: z.string().min(3, "O modelo deve ter pelo menos 3 caracteres"),
	plate: z
		.string()
		.regex(/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, "Placa inválida"), // validação no backend/mask
	manufacture: z.number().int().positive().nullable().optional(),
	km: z.number().int().nonnegative().nullable().optional(),
	fuel: CarFuelEnum,
	strength: z.string().nullable().optional(),
	capacity: z.string().nullable().optional(),
	versatility: z.string().nullable().optional(),
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
})

export type Car = z.infer<typeof CarSchema>
