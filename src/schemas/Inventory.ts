import z from "zod"

export const StockMovementTypeEnum = z.enum(["in", "out"])

export const InventorySchema = z.object({
	id: z.uuid(),
	product_id: z.uuid(),
	current_quantity: z.number().positive("Valor deve ser positivo"),
	reserved_quantity: z.number().positive("Valor deve ser positivo"),
	available_quantity: z.number().positive("Valor deve ser positivo"),
	last_updated: z.coerce.date().nullable().optional(),
})

export const StockMovementSchema = z.object({
	id: z.uuid(),
	product_id: z.uuid(),
	order_id: z.uuid(),
	movement_type: StockMovementTypeEnum,
	quantity: z.number().positive("Valor deve ser positivo"),
	movement_date: z.coerce.date().nullable().optional(),
	observations: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
})

// Gerar o tipo TypeScript automaticamente
export type Inventory = z.infer<typeof InventorySchema>

export type StockMovement = z.infer<typeof StockMovementSchema>
