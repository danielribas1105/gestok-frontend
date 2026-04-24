import z from "zod"

export const OrderTypeEnum = z.enum(["in", "out"])

export const OrderStatusEnum = z.enum([
	"pending",
	"processed",
	"canceled",
	"in_transit",
	"concluded",
])

export const OrderSchema = z.object({
	id: z.uuid(),
	code: z.string(),
	client_id: z.uuid(),
	car_id: z.uuid(),
	created_by: z.uuid(),
	observations: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	type: OrderTypeEnum,
	status: OrderStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	processed_at: z.coerce.date().nullable().optional(),
})

// Gerar o tipo TypeScript automaticamente
export type Order = z.infer<typeof OrderSchema>
