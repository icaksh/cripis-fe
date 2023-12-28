import axios from "axios";
import moment from "moment/moment";

const axiosInstance = axios.create()
export const register = (data) => {
    const body = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        card_number: parseInt(data.nik),
        address: data.address,
        sex: parseInt(data.sex),
        dob: moment(data.birth).toISOString(),
        village: parseInt(data.village),
        district: parseInt(data.district),
        regency: parseInt(data.regency),
        province: parseInt(data.province),
        postal_code: parseInt(data.zipcode),
        'g-recaptcha-response': data.captcha
    }
    const requestOptions = {
        url: process.env.VUE_APP_BACKEND_URL+`/public/auth/register`,
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