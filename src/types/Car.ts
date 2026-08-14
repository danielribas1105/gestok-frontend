import { Driver } from "./Driver"

export interface Car {
	id: string
	model: string
	plate: string
	driver: Driver
	manufacture: number
	km: number
	fuel: string
	strength: string
	capacity: number
	versatility: string
	active: boolean
	created_at: string
	image: string
}
