const AdminRoutes = [
    {
        path: "/admin/trademark/list",
        name: "admin-trademark-list",
        meta: { authRequired: true },
        component: () => import("../pages/admin/trademark/list.vue"),
    },
    {
        path: "/admin/trademark/:id",
        name: "admin-trademark-edit",
        meta: { authRequired: true },
        component: () => import("../pages/admin/trademark/forms.vue"),
    },
    {
        path: "/admin/account/list",
        name: "admin-user-list",
        meta: { authRequired: true },
        component: () => import("../pages/admin/user/list.vue"),
    },
    {
        path: "/admin/account/:id",
        name: "admin-user-edit",
        meta: { authRequired: true },
        component: () => import("@/pages/admin/user/forms.vue"),
    },

    {
        path: "/admin/announcement/list",
        name: "admin-announcement-list",
        meta: { authRequired: true },
        component: () => import("@/pages/admin/announcement/list.vue"),
    },
    {
        path: "/admin/announcement/create",
        name: "admin-announcement-create",
        meta: { authRequired: true },
        component: () => import("@/pages/admin/announcement/forms.vue"),
    },
    {
        path: "/admin/announcement/:id",
        name: "admin-announcement-edit",
        meta: { authRequired: true },
        component: () => import("@/pages/admin/announcement/forms.vue"),
    },

    {
        path: "/admin/logs/list",
        name: "admin-logs-list",
        meta: { authRequired: true },
        component: () => import("@/pages/admin/logs/list.vue"),
    }
]

export default AdminRoutes;