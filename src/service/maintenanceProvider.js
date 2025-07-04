import { api } from "./config/api";

export const getMaintenanceProviders = async () => {
    try {
        const response = await api.get('/maintenance-providers')

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error("[getMaintenanceProviders] error:", error);
        throw error
    }
}
