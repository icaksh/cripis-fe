import axios from "axios";

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

export const editTrademark = (data) => {
    const formData = new FormData();
    formData.append('id', data.id)
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
    formData.append('new_image', data.new_image);
    formData.append('new_sme_certificate', data.new_certificate);
    formData.append('new_register_signature', data.new_signature);
    const requestOptions = {
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        },
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademark/',
        method: 'PUT',
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

export const deleteTrademark = (id) => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+'/private/trademark/'+id,
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
