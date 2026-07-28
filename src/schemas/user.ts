import { validateCPF } from "@/utils/validate-cpf"
import { validatePhone } from "@/utils/validate-phone"
import z from "zod"

export const UserProfileEnum = z.enum(["admin", "operator", "user"])

export const UserSchema = z.object({
	id: z.uuid(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.email(),
	cpf: z
		.string()
		.regex(
			/^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
			"CPF deve estar no formato XXX.XXX.XXX-XX",
		)
		.refine(validateCPF, "CPF inválido")
		.nullable()
		.optional(),
	phone: z
		.string()
		.regex(
			/^\(\d{2}\)\s\d{4,5}-\d{4}$/,
			"Telefone deve estar no formato (XX) XXXXX-XXXX",
		)
		.refine(validatePhone, "Telefone inválido")
		.nullable()
		.optional(),
	email_verified: z.boolean(),
	profile: UserProfileEnum,
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>
