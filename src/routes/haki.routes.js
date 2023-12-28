
const HakiRoutes = [
    {
        path: "/haki/list",
        name: "haki-list",
        meta: { authRequired: true},
        component: () => import("../pages/haki/list/list.vue"),
    },{
        path: "/haki/registration",
        name: "haki-register",
        meta: { authRequired: true},
        component: () => import("../pages/haki/register/register.vue"),
    },{
        path: "/haki/:id",
        name: "haki-edit",
        meta: { authRequired: true},
        component: () => import("../pages/haki/list/edit.vue"),
    },

]
export default HakiRoutes;