import { api } from "./config/api";

export const getUsers = async () => {
	try {
		const response = await api.get('/users')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getUsers] error:", error);
		throw error
	}
}

export const getProfile = async () => {
	try {
		const response = await api.get("/users/profile")

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getProfile] error:", error);
		throw error
	}
}
