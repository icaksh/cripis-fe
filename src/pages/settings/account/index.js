import axios from 'axios'
import moment from "moment";

export const user = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/user/`,
        method: 'GET',
    }
    return axios(requestOptions).then(
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

export const editUserProfile = (value) => {
    const data = {
        email: value.email,
        first_name: value.first_name,
        last_name: value.last_name,
        phone: parseInt(value.phone),
        card_number: parseInt(value.card_number),
        sex: parseInt(value.sex),
        dob: moment(value.dob),
        address: value.address,
        village: parseInt(value.village),
        district: parseInt(value.district),
        regency: parseInt(value.regency),
        province: parseInt(value.province),
        postal_code: parseInt(value.postal_code)

    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/user/`,
        method: 'PUT',
        data: data
    }
    return axios(requestOptions).then(
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

export const editUserPassword = (value) => {
    console.log(value)
    const data = {
        old_password: value.old_password,
        password: value.password
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/user/password`,
        method: 'PUT',
        data: data
    }
    return axios(requestOptions).then(
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