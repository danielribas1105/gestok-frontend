import z from "zod"
import validateCPF from "@/utils/validate-cpf"

export const LicenseTypeEnum = z.enum(["A", "B", "C", "D", "E"])

export const DriverSchema = z.object({
	id: z.uuid(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	cpf: z
		.string()
		.regex(
			/^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
			"CPF deve estar no formato XXX.XXX.XXX-XX",
		)
		.refine(validateCPF, "CPF inválido")
		.nullable()
		.optional(),
	license: z.string(),
	type: LicenseTypeEnum,
	validity: z.coerce.date().nullable().optional(),
	phone: z
		.string()
		.regex(
			/^\(\d{2}\)\s\d{4,5}-\d{4}$/,
			"Telefone deve estar no formato (XX) XXXXX-XXXX",
		)
		.nullable()
		.optional(),
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
})

// Gerar o tipo TypeScript automaticamente
export type Driver = z.infer<typeof DriverSchema>
