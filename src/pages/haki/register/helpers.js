import axios from "axios";

const axiosInstance = axios.create()

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

export const postRegister = (data) => {
    const formData = new FormData();
    formData.append('trademark_name', data.name);
    formData.append('trademark_class', data.class);
    formData.append('owner_name', data.fullName);
    formData.append('address', data.address);
    formData.append('village', data.village);
    formData.append('district', data.district);
    formData.append('regency', data.regency);
    formData.append('province', data.province);
    formData.append('image', data.image);
    formData.append('sme_certificate', data.certificate);
    formData.append('register_signature', data.signature);
    const requestOptions = {
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademark/',
        method: 'POST',
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
export const getSimilarity = (name) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/public/trademark/search?keyword='+name,
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
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademarks',
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
