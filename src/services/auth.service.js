import axios from "axios";
import HeaderService from "@/services/header.service.js";
import fastLocalStorage from "fastlocalstorage";
class AuthService {
    uninterceptedRequest(options){
        const uninterceptedAxiosInstance = axios.create();
        return uninterceptedAxiosInstance(options).then(
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
            }
        )
    }
    stringToBool(str) {
        // Convert to lowercase to make the comparison case-insensitive
        if(str){
            const lowerStr = str.toLowerCase().trim();
            // Check for truthy values
            if (lowerStr === 'true' || lowerStr === '1' || lowerStr === 'yes') {
                return true;
            }
            if (lowerStr === 'false' || lowerStr === '0' || lowerStr === 'no') {
                return false;
            }
        }
        return false;
    }

    login(email, password, captcha, remember) {
        const rememberValue = this.stringToBool(remember)
        const requestOptions = {
            url: process.env.VUE_APP_BACKEND_URL+'/public/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ email, password, 'g-recaptcha-response': captcha, rememberValue})
        };
        return this.uninterceptedRequest(requestOptions)
    }

    profile() {
        const requestOptions = {
            url: process.env.VUE_APP_BACKEND_URL+'/private/auth/profile',
            method: 'GET',
        }
        return axios(requestOptions)
            .then( ()=>{
                    return "ok"
            }).catch((err)=>{
                if(err.response.status === 404) {
                    return "no"
                }else{
                    return "Terjadi Kesalahan"
                }
            })
    }

    registerProfile() {
        const requestOptions = {
            url: process.env.VUE_APP_BACKEND_URL+'/private/auth/profile/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
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
            }
        )
    }

    registerUser(data) {
        const body = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password
        }
        const requestOptions = {
            url: process.env.VUE_APP_BACKEND_URL+'/public/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(body)
        };
        return this.uninterceptedRequest(requestOptions)
    }

    logout() {
        const requestOptions = {
            url: process.env.VUE_APP_BACKEND_URL+'/private/auth/logout',
            method: 'POST',
            headers: HeaderService.authHeader(),
        }
        return axios(requestOptions)
            .then(user =>{
                fastLocalStorage.clear();
                return user.data;
            })
    }



}


export default new AuthService();