import z from "zod"

export const OrderItemSchema = z.object({
	id: z.uuid(),
	order_id: z.string(),
	product_id: z.uuid(),
	quantity: z.number().positive("Valor deve ser positivo"),
	total_price: z.number().positive("Valor deve ser positivo"),
})

// Gerar o tipo TypeScript automaticamente
export type OrderItem = z.infer<typeof OrderItemSchema>
