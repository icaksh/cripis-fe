import axios from 'axios';
import fastLocalStorage from "fastlocalstorage";

export default {
    install: (Vue) => {

        axios.interceptors.request.use(
            (config) => {
                const user = JSON.parse(fastLocalStorage.getItem('user'));
                if (user && user.access_token) {
                    config.headers.Authorization = `Bearer ${user.access_token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const user = JSON.parse(fastLocalStorage.getItem('user'));
                        const uninterceptedAxiosInstance = axios.create();
                        const response = await uninterceptedAxiosInstance.post(process.env.VUE_APP_BACKEND_URL+'/public/auth/refresh', {
                            refresh_token: user.refresh_token,
                        });
                        fastLocalStorage.removeItem('user')
                        fastLocalStorage.setItem('user', JSON.stringify(response.data));
                        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                        return axios(originalRequest);

                    } catch (refreshError) {
                        Vue.$store.dispatch('logout');
                    }
                }
                return Promise.reject(error);
            }
        );
    },
};
