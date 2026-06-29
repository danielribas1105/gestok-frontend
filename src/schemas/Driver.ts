import z from "zod"

export const LicenseTypeEnum = z.enum(["A", "B", "C", "D", "E"])

// Leitura — o que vem da API (sem user_id, pois já está aninhado no User)
export const DriverProfileReadSchema = z.object({
	license: z.string(),
	type: LicenseTypeEnum,
	validity: z.coerce.date().nullable().optional(),
	ear: z.boolean().nullable().optional(),
})

// Escrita — o que é enviado no create/update
export const DriverProfileCreateSchema = z.object({
	license: z.string().min(1, "Número da CNH é obrigatório"),
	type: LicenseTypeEnum,
	validity: z.coerce.date().nullable().optional(),
	ear: z.boolean().nullable().optional(),
})

export type DriverProfileRead = z.infer<typeof DriverProfileReadSchema>
export type DriverProfileCreate = z.infer<typeof DriverProfileCreateSchema>
