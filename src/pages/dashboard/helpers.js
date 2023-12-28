import axios from "axios";
import moment from "moment";


const axiosInstance = axios.create()
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

export const getLogsTrademarks = (year, month) => {
    let endpoint ="/"
    if(year){
        endpoint += moment().format('YYYY')+"/"
    }
    if(month){
        endpoint += moment().format('MM')
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/log/trademark'+endpoint,
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

export const getLogsLogin= (year, month) => {
    let endpoint ="/"
    if(year){
        endpoint += moment().format('YYYY')+"/"
    }
    if(month){
        endpoint += moment().format('MM')
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/log/login'+endpoint,
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