import z from "zod"
import validateCPF from "@/utils/validate-cpf"
import { DriverProfileCreateSchema, DriverProfileReadSchema } from "./Driver"

export const UserProfileEnum = z.enum(["admin", "operator", "driver"])

export const UserSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.string().email(),
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
		.nullable()
		.optional(),
	email_verified: z.boolean(),
	profile: UserProfileEnum,
	active: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	image: z.string().nullable().optional(),
	driver_profile: DriverProfileReadSchema.nullable().optional(), // 👈
})

// Escrita — create
export const UserCreateSchema = z
	.object({
		name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
		email: z.string().email("E-mail inválido"),
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
			.nullable()
			.optional(),
		profile: UserProfileEnum,
		password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
		confirm_password: z.string(),
		driver: DriverProfileCreateSchema.optional(), // 👈
	})
	.refine((d) => d.password === d.confirm_password, {
		message: "As senhas não coincidem",
		path: ["confirm_password"],
	})
	.refine((d) => d.profile !== "driver" || !!d.driver?.license, {
		message: "Dados do motorista são obrigatórios para o perfil Driver",
		path: ["driver", "license"],
	})

// Escrita — update (todos opcionais)
export const UserUpdateSchema = z
	.object({
		name: z.string().min(3).optional(),
		email: z.string().email().optional(),
		cpf: z
			.string()
			.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
			.refine(validateCPF)
			.nullable()
			.optional(),
		phone: z
			.string()
			.regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
			.nullable()
			.optional(),
		profile: UserProfileEnum.optional(),
		password: z.string().min(6).optional(),
		confirm_password: z.string().optional(),
		driver: DriverProfileCreateSchema.optional(), // 👈
	})
	.refine((d) => !d.password || d.password === d.confirm_password, {
		message: "As senhas não coincidem",
		path: ["confirm_password"],
	})

export type User = z.infer<typeof UserSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
