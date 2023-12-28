
const DashboardRoutes = [
    {
        path: "/",
        name: "public",
        component: () => import("../pages/public/public.vue"),

    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: { authRequired: true},
        component: () => import("../pages/dashboard/info.vue"),

    },
]
export default DashboardRoutes;