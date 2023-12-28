import axios from 'axios'
import moment from "moment";

const axiosInstance = axios.create()
export const users = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/users',
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
                const message = "Gagal mendapatkan daftar pengguna";
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

export const user = (id) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/user/${id}`,
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
                const message = "Gagal mendapatkan data pengguna";
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

export const editUserProfile = (value) => {
    const data = {
        id: value.id,
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

export const editUserRoles = (value) => {
    const data = {
        id: value.id,
        status: value.status,
        roles: value.roles,
        verified: value.verified,
        password: value.password
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/user/status/`,
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

export const userRoles = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/user/roles',
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
                const message = "Gagal mendapatkan status pengguna";
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

export const deleteUser = (id) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/user/'+id,
        method: 'DELETE',
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