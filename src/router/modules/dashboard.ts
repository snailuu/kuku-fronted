const Layout = () => import("@/layout/index.vue");

export default [
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        meta: {
            title: "首页",
            icon: 'ele-house'
        },
        children: [
            {
                path: "/home",
                name: "Home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "首页",
                    icon: 'House',
                    isHome: true
                }
            }
        ]
    }
] as RouteConfigsTable[];
