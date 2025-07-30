import { api } from "./config/api";

export const getMaintenances = async () => {
	try {
		const response = await api.get('/maintenance')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getMaintenances] error:", error);
		throw error
	}
}

export const createMaintenance = async (maintenance) => {
	try {
		const response = await api.post('/maintenance/create', maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createMaintenance] error:", error);
		throw error
	}
}

export const updateMaintenance = async (maintenance) => {
	try {
		const response = await api.put(`/maintenancesdfsfsf/${maintenance.id}`, maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateMaintenance] error:", error);
		throw error
	}
}

export const changeStatus = async (id) => {
	try {
		const response = await api.put(`/maintenance/update-status/${id}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
