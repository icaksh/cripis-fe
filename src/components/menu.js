export const menuItems = [
    {
        id: 1,
        label: "Halaman Utama",
        isTitle: true
    },
    {
        id: 2,
        label: "Dashboard",
        link: "/dashboard",
        icon: "bx-home-circle"
    },
    {
        id: 5,
        label: "Admin",
        isTitle: true,
        isAdmin: true
    },
    {
        id: 6,
        label: "Merek Dagang",
        link: "/admin/trademark/list",
        icon: "bx-select-multiple",
        isAdmin: true
    },
    {
        id: 7,
        label: "Pengguna",
        link: "/admin/account/list",
        icon: "bx-user-plus",
        isAdmin: true
    },
    {
        id: 8,
        label: "Aplikasi",
        icon: "bx-server",
        isAdmin: true,
        subItems: [
            {
                id: 1,
                label: "Pengumuman",
                link: "/admin/announcement/list",
                parentId: 8
            },
            {
                id: 2,
                label: "Logs",
                link: "/admin/logs/list",
                parentId: 8
            },
        ]
    },
    {
        id: 11,
        label: "Merek Dagang",
        isTitle: true,
    },
    {
        id: 12,
        label: "Pendaftaran",
        link: "/haki/registration",
        icon: "bx-file"
    },
    {
        id: 13,
        label: "Daftar/List",
        link: "/haki/list",
        icon: "bx-list-check"
    },
    {
        id: 21,
        label: "Pengaturan",
        isTitle: true
    },
    {
        id: 23,
        label: "Akun",
        link: "/setting/account",
        icon: "bx-user-circle"
    },

    {
        id: 31,
        label: "Lainnya",
        isTitle: true
    },


    {
        id: 34,
        label: "Keluar",
        link: "/logout",
        icon: "bx-power-off"
    }
];