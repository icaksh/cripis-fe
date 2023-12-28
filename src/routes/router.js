import { createWebHistory, createRouter } from "vue-router";

// import VueMeta from 'vue-meta'
import AuthRoutes from "@/routes/auth.routes.js";
import DashboardRoutes from "@/routes/dashboard.routes";
import HakiRoutes from "@/routes/haki.routes";
import fastLocalStorage from "fastlocalstorage";
import AdminRoutes from "@/routes/admin.routes";
import UserRoutes from "@/routes/user.routes";

// Vue.use(VueRouter)
// Vue.use(VueMeta, {
//   // The component option name that vue-meta looks for meta info on.
//   keyName: 'page',
// })

const routes = [
    ...AuthRoutes,
    ...DashboardRoutes,
    ...HakiRoutes,
    ...AdminRoutes,
    ...UserRoutes
]

const RouterService = createRouter({
    history: createWebHistory(),
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
})

RouterService.beforeEach((routeTo, routeFrom, next) => {
    console.log({routeTo, routeFrom})
    const publicPages = ['/login', '/register', '/', '/reset'];
    const authPage = !publicPages.includes(routeTo.path);
    const loggedUser = fastLocalStorage.getItem('user');
    if (authPage && !loggedUser){
        return next('/login');
    }

    next();
})

RouterService.beforeResolve(async (routeTo, routeFrom, next) => {
    // Create a `beforeResolve` hook, which fires whenever
    // `beforeRouteEnter` and `beforeRouteUpdate` would. This
    // allows us to ensure data is fetched even when params change,
    // but the resolved route does not. We put it in `meta` to
    // indicate that it's a hook we created, rather than part of
    // Vue Router (yet?).
    try {
        // For each matched route...
        for (const route of routeTo.matched) {
            await new Promise((resolve, reject) => {
                // If a `beforeResolve` hook is defined, call it with
                // the same arguments as the `beforeEnter` hook.
                if (route.meta && route.meta.beforeResolve) {
                    route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
                        // If the account chose to redirect...
                        if (args.length) {
                            // If redirecting to the same route we're coming from...
                            // Complete the redirect.
                            next(...args)
                            reject(new Error('Redirected'))
                        } else {
                            resolve()
                        }
                    })
                } else {
                    // Otherwise, continue resolving the route.
                    resolve()
                }
            })
        }
        // If a `beforeResolve` hook chose to redirect, just return.
    } catch (error) {
        return
    }

    // If we reach this point, continue resolving the route.
    next()
})
export default RouterService
