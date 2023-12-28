import axios from "axios";

export const logout = () => {
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/private/auth/logout`,
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
                const message = "Gagal melakukan Logout";
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