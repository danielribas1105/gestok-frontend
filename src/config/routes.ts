import { create } from "domain"

export const routes = {
	home: "/",
	login: "/login",
	users: {
		list: "/users",
		create: "/users",
		update: (id: string) => `/users/${id}`,
		delete: (id: string) => `/users/${id}`,
		getById: (id: string) => `/users/${id}`,
		getDriverList: "/users/driver-list",
	},
	cars: {
		list: "/cars",
		create: "/cars",
		update: (id: string) => `/cars/${id}`,
		delete: (id: string) => `/cars/${id}`,
		getById: (id: string) => `/cars/${id}`,
	},
	clients: {
		list: "/clients",
		create: "/clients",
		update: (id: string) => `/clients/${id}`,
		delete: (id: string) => `/clients/${id}`,
		getById: (id: string) => `/clients/${id}`,
	},
	works: {
		list: "/works",
		create: "/works",
		update: (id: string) => `/works/${id}`,
		delete: (id: string) => `/works/${id}`,
	},
	jobs: {
		list: "/jobs",
		create: "/jobs",
		update: (id: string) => `/jobs/${id}`,
		delete: (id: string) => `/jobs/${id}`,
	},
	orders: {
		list: "/orders",
		create: "/orders",
		update: (id: string) => `/orders/${id}`,
		delete: (id: string) => `/orders/${id}`,
	},
	statements: {
		list: "/statements",
		create: "/statements",
		update: (id: string) => `/statements/${id}`,
		delete: (id: string) => `/statements/${id}`,
	},
	products: {
		list: "/products",
		create: "/products",
		update: (id: string) => `/products/${id}`,
		delete: (id: string) => `/products/${id}`,
	},
	payments: {
		list: "/payments",
		create: "/payments",
		update: (id: string) => `/payments/${id}`,
		delete: (id: string) => `/payments/${id}`,
	},
}
