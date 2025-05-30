import { api } from "./config/api";

export const getUsers = async () => {
	try {
		const response = await api.get('/users/with-roles');
		return response.status === 200 ? response.data : false;
	} catch (error) {
		console.error(error);
		return false;
	}
};	