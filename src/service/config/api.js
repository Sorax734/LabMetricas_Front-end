import axios from 'axios';

let user = localStorage.getItem('user')
user = JSON.parse(user)
const token = user.token

const api = axios.create({
	baseURL: 'http://localhost:8001/api',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	},
	timeout: 3600000,
});

export { api };
