import z from "zod"

export const ProductSchema = z.object({
	id: z.uuid(),
	name_code: z.string(),
	name: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	code: z.string(),
	unit: z.string().min(2, "Unidade deve ter pelo menos 2 caracteres"),
	volume_m3_per_unit: z.number().nonnegative().nullable().optional(),
	weight_kg_per_unit: z.number().nonnegative().nullable().optional(),
	boxes_per_pallet: z.number().nonnegative().nullable().optional(),
	active: z.boolean().optional(),
	image: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

// Gerar o tipo TypeScript automaticamente
export type Product = z.infer<typeof ProductSchema>
