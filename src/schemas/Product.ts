import z from "zod"

export const ProductSchema = z.object({
	id: z.uuid(),
	code: z.string(),
	description: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	unit: z.string().min(2, "Unidade deve ter pelo menos 2 caracteres"),
	value: z.number().positive("Valor deve ser positivo"),
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
})

// Gerar o tipo TypeScript automaticamente
export type Product = z.infer<typeof ProductSchema>
