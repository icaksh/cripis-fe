import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

export default {
    install(app) {
        const vuetify = new Vuetify();
        app.config.globalProperties.$vuetify = vuetify;
        app.use(vuetify);
    },
};
