import axios from 'axios'

const axiosInstance = axios.create()
export const getTrademarkClasses = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/trademark/class',
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


export const getTrademark = (id) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademark/'+id,
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

export const acceptTrademark = (val) => {
    const data = {
        id: val.id,
        status: parseInt(val.status),
        notes: val.notes
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademark/status/',
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

export const getTrademarkStatus = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/trademark/status',
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

export const getDak = (province, regency, district, village) => {
    const requestOptions = {
        url: `${process.env.VUE_APP_BACKEND_URL}/public/dak/${province}/${regency}/${district}/${village}`,
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

export const getTrademarks = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademarks/admin',
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

