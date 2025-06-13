import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 60000, //60 segundos
    headers: {
		"Content-Type": 'application/json',
    },
});

api.interceptors.request.use((config) => {
	const user = localStorage.getItem("user")
	let userObject

	try {
		userObject = JSON.parse(user);
	} catch (err) {
		console.error('No se pudo parsear `user` desde localStorage:', err);
	}

    if (userObject.token) {
      	config.headers.Authorization = `Bearer ${userObject.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export { api };
