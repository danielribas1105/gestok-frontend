import { z } from "zod"
import { DriverSchema } from "./Driver"

// ---------------------------------------------------------------------------
// Enums — espelham CarFuel / CapacityUnit do backend
// ---------------------------------------------------------------------------

export const CarFuelEnum = z.enum([
	"diesel",
	"gasoline",
	"ethanol",
	"electric",
	"gnv",
	"hybrid",
])
export type CarFuel = z.infer<typeof CarFuelEnum>

export const CapacityUnitEnum = z.enum(["m3", "boxes", "kg", "pallets"])
export type CapacityUnit = z.infer<typeof CapacityUnitEnum>

// ---------------------------------------------------------------------------
// CarCapacity — espelha CarCapacityCreate / Update / Read
// ---------------------------------------------------------------------------

export const CarCapacityCreateSchema = z.object({
	unit: CapacityUnitEnum,
	value: z.number().positive("Valor deve ser maior que zero"),
})
export type CarCapacityCreate = z.infer<typeof CarCapacityCreateSchema>

export const CarCapacityUpdateSchema = CarCapacityCreateSchema.extend({
	id: z.uuid().optional(), // presente = update; ausente = create
})
export type CarCapacityUpdate = z.infer<typeof CarCapacityUpdateSchema>

export const CarCapacityReadSchema = z.object({
	id: z.uuid(),
	unit: CapacityUnitEnum,
	value: z.number(),
})
export type CarCapacityRead = z.infer<typeof CarCapacityReadSchema>

// ---------------------------------------------------------------------------
// Car — espelha CarCreate / Update / Read
// ---------------------------------------------------------------------------

const plateRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/

const CarBaseSchema = z.object({
	model: z.string().min(3, "O modelo deve ter pelo menos 3 caracteres"),
	plate: z.string().regex(plateRegex, "Placa inválida"),
	driver_id: z.uuid(),
	manufacture: z.number().int().positive().nullable().optional(),
	km: z.number().int().nonnegative().nullable().optional(),
	fuel: CarFuelEnum,
	strength: z.string().nullable().optional(),
	versatility: z.string().nullable().optional(),
	active: z.boolean().optional(),
	image: z.string().nullable().optional(),
})

export const CarCreateSchema = CarBaseSchema.extend({
	capacities: z.array(CarCapacityCreateSchema).default([]),
})
export type CarCreate = z.infer<typeof CarCreateSchema>

// .partial() torna todo campo do base opcional — sem precisar reescrever nada
export const CarUpdateSchema = CarBaseSchema.partial().extend({
	capacities: z.array(CarCapacityUpdateSchema).optional(),
})
export type CarUpdate = z.infer<typeof CarUpdateSchema>

export const CarSchema = CarBaseSchema.extend({
	id: z.uuid(),
	active: z.boolean(),
	created_at: z.coerce.date().nullable().optional(),
	driver: DriverSchema.nullable().optional(),
	capacities: z.array(CarCapacityReadSchema).default([]),
})
export type Car = z.infer<typeof CarSchema>
