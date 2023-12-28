
const initialState = () =>({
    type: null,
    message: null
});

const state = {
    type: null,
    message: null
};

const mutations = {
    SUCCESS(state, message) {
        state.type = 'alert-success';
        state.message = message;
    },
    ERROR(state, message) {
        state.type = 'alert-danger';
        state.message = message;
    },
    INFO(state, message){
        state.type = 'alert-info';
        state.message = message;
    },
    CLEAR(state) {
        state.type = null;
        state.message = null;
    },
    RESET(state) {
        const newState = initialState;
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        });
    },
};

const actions = {
    success({ commit }, message) {
        commit('SUCCESS', message);
    },
    info({ commit }, message) {
        commit('INFO', message);
    },
    error({ commit }, message) {
        commit('ERROR', message);
    },
    clear({ commit }) {
        commit('CLEAR');
    }
};


export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
