import { z } from "zod"

export const ClientSchema = z.object({
	id: z.uuid(),
	code: z.string(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	trade_name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	cnpj: z.string(),
	insc_e: z.string(),
	phone: z
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
	zip_code: z.string().max(8, "O CEP possui 8 dígitos").nullable().optional(),
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
	contact: z.string(),
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
})

export type Client = z.infer<typeof ClientSchema>
