import axios from 'axios';

const instance = axios.create({ baseURL: 'http://localhost:4000/api' });

const startGame = async () => {
	try {
		const { data: { msg }} = await instance.post('/start');
		return { status: 200, msg: msg };
	}
	catch (e) {
		return { status: 503, msg: "Service Unavailable" };
	}
}
const guess = async (number) => {
	try {
		const res = await instance.get(`/guess?number=${number}`);
		if (res.status === 200) {
			return { status: 200, msg: res.data.status };
		}
		else {
			return { status: 406, msg: "Error" };
		}
	} 
	catch (e) {
		const res = e.response;
		if (res.status === 406) {
			return { status: 406, msg: "Error" };
		}
		else {
			return { status: 503, msg: "Service Unavailable" };
		}
	}
}
const restart = async () => {	
	try {
		const { data: { msg }} = await instance.post('/restart');
		return { status: 200, msg: msg };
	}
	catch (e) {
		return { status: 503, msg: "Service Unavailable" };
	}
}

export { startGame, guess, restart };