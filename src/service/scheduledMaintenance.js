import { api } from "./config/api";

export const getScheduledMaintenances = async () => {
	try {
		const response = await api.get('/maintenance/scheduled')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getScheduledMaintenances] error:", error);
		throw error
	}
}
