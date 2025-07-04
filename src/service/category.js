import { api } from "./config/api";

export const getCategories = async () => {
	try {
		const response = await api.get('/equipment-categories')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getCategories] error:", error);
		throw error
	}
}
