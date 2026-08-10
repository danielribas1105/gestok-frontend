import z from "zod"

export const OrderOperationEnum = z.enum(["sale", "tasting", "bonus"])

export const OrderStatusEnum = z.enum([
	"pending",
	"processed",
	"blocked",
	"in_transit",
	"canceled",
	"concluded",
])

export const OrderSchema = z.object({
	id: z.uuid(),
	branch_code: z.string(), // Filial
	code: z.string(), // Pedido
	issued_at: z.coerce.date().nullable().optional(), // Emissão do pedido
	operation_type: OrderOperationEnum,
	release_reason: z.string().nullable().optional(),
	released_at: z.coerce.date().nullable().optional(),
	client_id: z.uuid(),
	store_id: z.uuid(),
	saller_id: z.uuid(),
	supervisor_id: z.uuid(),
	manager_id: z.uuid(),
	status: OrderStatusEnum,
	observations: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	processed_at: z.coerce.date().nullable().optional(),
})

export type Order = z.infer<typeof OrderSchema>
