import {createLogger, createStore} from 'vuex'

import modules from './modules'

const store = createStore({
    modules,
    actions: {
        reset({commit}) {
            Object.keys(modules).forEach(moduleName => {
                commit(`${moduleName}/RESET`);
            })
        }
    },
    strict: 'debug',
    plugins: [createLogger()]
})
export default store

