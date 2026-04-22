import { create } from "domain"

export const routes = {
	home: "/",
	login: "/login",
	users: {
		list: "/users",
		create: "/users",
		update: (id: string) => `/users/${id}`,
		delete: (id: string) => `/users/${id}`,
	},
	cars: {
		list: "/cars",
		create: "/cars",
		update: (id: string) => `/cars/${id}`,
		delete: (id: string) => `/cars/${id}`,
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
	statements: {
		list: "/statements",
		create: "/statements",
		update: (id: string) => `/statements/${id}`,
		delete: (id: string) => `/statements/${id}`,
	},
	materials: {
		list: "/materials",
		create: "/materials",
		update: (id: string) => `/materials/${id}`,
		delete: (id: string) => `/materials/${id}`,
	},
	payments: {
		list: "/payments",
		create: "/payments",
		update: (id: string) => `/payments/${id}`,
		delete: (id: string) => `/payments/${id}`,
	},
}
