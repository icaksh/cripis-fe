import store from "@/store";

const AuthRoutes = [{
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/login.vue"),
    meta: {
        beforeResolve(routeTo, routeFrom, next) {
            if (store.getters["Auth/getStatus"].loggedIn) {
                next({name:"dashboard"});
            } else {
                next();
            }
        },
    },

},{
    path: "/logout",
    name: "logout",
    component: () => import("@/pages/auth/logout/logout.vue"),
    meta: {
        authRequired: true,
        beforeResolve(routeTo, routeFrom, next) {
            store.dispatch("Auth/logout")
            const authRequiredOnPreviousRoute = routeFrom.matched.some(
                (route) => route.meta.authRequired
            );
            if (authRequiredOnPreviousRoute) {
                next({ name: "login" });
            } else {
                next();
            }
        },
    }
},
    {
        path: "/register",
        name: "Register",
        component: () => import("../pages/auth/register/register.vue"),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                if (store.getters["Auth/loggedIn"]) {
                    next({ name: "dashboard" });
                } else {
                    next();
                }
            },
        },
    },
    {
        path: "/reset",
        name: "Reset",
        component: () => import("../pages/auth/reset/reset.vue"),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                if (store.getters["Auth/loggedIn"]) {
                    next({ name: "dashboard" });
                } else {
                    next();
                }
            },
        },
    },]

export default AuthRoutes;