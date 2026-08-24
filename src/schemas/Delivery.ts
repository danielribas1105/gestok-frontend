import z from "zod"

export const DeliveryStatusEnum = z.enum([
	"pending",
	"in_transit",
	"return",
	"canceled",
	"concluded",
])

export const DeliverySchema = z.object({
	id: z.uuid(),
	order_id: z.uuid(),
	car_id: z.uuid(),
	user_id: z.uuid(),
	invoice: z.string(),
	weight: z.string(),
	status: DeliveryStatusEnum,
	observations: z.string().nullable().optional(),

	created_at: z.coerce.date().nullable().optional(),
	departed_at: z.coerce.date().nullable().optional(),
	delivery_at: z.coerce.date().nullable().optional(),
	delivery_confirmed: z.boolean(),
})

export type Delivery = z.infer<typeof DeliverySchema>
