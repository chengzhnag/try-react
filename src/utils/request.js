import axios from 'axios';
import { Toast } from 'antd-mobile';


const service = axios.create({
	baseURL: 'http://zsjustn.top',
	timeout: 15000
});

service.interceptors.request.use(
	config => {
		Toast.loading('Loading...', 0);
		return config;
	},
	error => {
		return Promise.reject();
	}
);

service.interceptors.response.use(
	response => {
		Toast.hide();
		if (response.status === 200) {
			return response.data;
		} else {
			return Promise.reject('出错了');
		}
	},
	error => {
		Toast.hide();
		if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
			return Promise.reject('请求超时, 请稍后重试'); // reject这个错误信息
		}
		return Promise.reject(error);
	}
);

export default service;
