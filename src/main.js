import BootstrapVueNext from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import { createApp } from 'vue'
import App from './App.vue'
import RouterService from "@/routes/router.js";
import store from "@/store";
import axiosInterceptor from "@/plugins/axios";

import "./design/app.scss";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueApexCharts from "vue3-apexcharts";

const vuetify = createVuetify({
    components,
    directives,
})


createApp(App)

    .use(vuetify)
    .use(axiosInterceptor)
    .use(BootstrapVueNext)
    .use(VueApexCharts)
    .use(require('vue-chartist'))
    .use(store)
    .use(RouterService).mount('#app')
