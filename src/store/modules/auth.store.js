import AuthService from "@/services/auth.service";
import router from "@/routes/router";
import {jwtDecode} from "jwt-decode";
import fastLocalStorage from "fastlocalstorage";

const user = JSON.parse(fastLocalStorage.getItem('user'));

const state = user ? {
        status: {loggedIn: true},
        user: user,
        details: jwtDecode(user.refresh_token),
    }: {
    status: {},
    user: null,
}

const getters = {
    loggedIn: state => {
        return state.status.loggedIn
    },
    getStatus: state => {
        return state.status
    },
    getUser: state => {
        return state.user
    },
    getDetails: state => {
        return state.details
    },
}

const actions = {

    async login({ dispatch, commit }, { email, password, captcha, remember }) {
        commit('LOGIN_REQUEST', { email });
        dispatch('Notification/info', "Sedang memproses login", { root: true });
        AuthService.login(email, password, captcha, remember).then(
            user => {
                commit('LOGIN_SUCCESS', user);
                fastLocalStorage.setItem('user', JSON.stringify(user));
                dispatch('Notification/success', "Login Berhasil", { root: true });
                router.push({name: 'dashboard'})
            },
            error => {
                commit('LOGIN_FAIL', error.message);
                dispatch('Notification/error', error.message, { root: true });
            }
        );
    },

    async logout({commit}) {
        AuthService.logout();
        commit('LOGOUT');
        router.push({name:'login'});
    },
}

const mutations = {
    LOGIN_REQUEST(state, user) {
        state.status = {loggingIn: true};
        state.user = user;
    },
    LOGIN_SUCCESS(state, user) {
        state.status = {loggeduser: true};
        state.details = jwtDecode(user.refresh_token);
        state.user = user;
    },
    LOGIN_FAIL(state) {
        state.status = {};
        state.user = null;
    },
    LOGOUT(state) {
        state.status = {};
        state.user = null;
    },
    REGISTER_REQUEST(state) {
        state.status = {registering: true};
    },
    REGISTER_SUCCESS(state) {
        state.status = {};
    },
    REGISTER_FAIL(state) {
        state.status = {};
    },
    RESET(state) {
        const newState = user;
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
