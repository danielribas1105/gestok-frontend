import z from "zod"

export const MaterialSchema = z.object({
	id: z.uuid(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	description: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	value_m3: z.number().positive("O valor por m3 deve ser um número positivo"),
})

export type Material = z.infer<typeof MaterialSchema>
