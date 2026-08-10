import z from "zod"

export const OrderItemSchema = z.object({
	order_id: z.string(),
	product_id: z.uuid().nullable().optional(),
	item_number: z.string().nullable().optional(),
	quantity: z.number().positive("Valor deve ser positivo"),
	total_price: z.number().positive("Valor deve ser positivo"),
	row_hash: z.string(),
})

// Gerar o tipo TypeScript automaticamente
export type OrderItem = z.infer<typeof OrderItemSchema>
