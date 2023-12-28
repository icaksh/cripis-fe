import axios from "axios";

const axiosInstance = axios.create()

export const getTrademarks = (val) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/trademarks?name='+val,
        method: 'GET',
    }
    return axiosInstance(requestOptions).then(
        response => {
            if(response.data) {
                return response.data;
            }
        },
        error => {
            if(error.response){
                return Promise.reject(error.response.data)
            }
            else if (error.request) {
                const message = "Periksa kembali koneksi internet Anda";
                const res = {
                    ...error.request,
                    message: message
                }
                return Promise.reject(res)
            }
        })

}
export const getAnnouncement = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/announcements',
        method: 'GET',
    }
    return axiosInstance(requestOptions).then(
        response => {
            if(response.data) {
                return response.data;
            }
        },
        error => {
            if(error.response){
                const message = "Gagal mendapatkan pengumuman";
                const res = {
                    ...error.request,
                    message: message
                }
                return Promise.reject(res)
            }
            else if (error.request) {
                const message = "Periksa kembali koneksi internet Anda";
                const res = {
                    ...error.request,
                    message: message
                }
                return Promise.reject(res)
            }
        })

}
