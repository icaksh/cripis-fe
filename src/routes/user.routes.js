const UserRoutes = [
    {
        path: "/setting/account",
        name: "setting-user",
        meta: { authRequired: true},
        component: () => import("@/pages/settings/account/user.vue"),
    }]
export default UserRoutes;