import axios from "axios";

const axiosInstance = axios.create()
export const reset = (data) => {
    const body = {
        email: data.email,
        'g-recaptcha-response': data.captcha
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/public/auth/reset`,
        method: 'POST',
        data: body,
    }

    return axiosInstance(requestOptions).then(
        response => {
            if(response.data) {
                console.log(response)
                return response.data;
            }
        },
        error => {
            if(error.response){
                console.log(error)
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
        }
        )

}