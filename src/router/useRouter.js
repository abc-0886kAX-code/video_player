/*
 * @FilePath: \video_player\src\router\useRouter.js
 * @Author: zhangxin
 * @Date: 2022-11-30 10:18:11
 * @LastEditors: zhangxin
 * @LastEditTime: 2024-07-23 16:21:06
 * @Description:
 */

import { defineRouter } from "./defineRouter";
import { defineMeta } from "@/router/meta";

const routes = [
    {
        name: "swzz-pc-player",
        path: "/swzz-pc-player",
        meta: defineMeta(),
        component: () => import("@/pages/swzz/pc.vue"),
    },
    {
        name: "swzz-wx-player",
        path: "/swzz-wx-player",
        meta: defineMeta(),
        component: () => import("@/pages/swzz/wx.vue"),
    },
    {
        name: "video-flv",
        path: "/video-flv",
        meta: defineMeta(),
        component: () => import("@/pages/video-flv.vue"),
    },
    {
        name: "video-m3u8",
        path: "/video-m3u8",
        meta: defineMeta(),
        component: () => import("@/pages/video-m3u8.vue"),
    },
    {
        name: "login",
        path: "/login",
        meta: defineMeta(),
        component: () => import("@/layout/login/login.vue"),
    },
    {
        name: "singleLogin",
        path: "/singleLogin",
        meta: defineMeta(),
        component: () => import("@/layout/loginsso/loginsso.vue"),
    },
    {
        name: "debug",
        path: "/debug",
        meta: defineMeta(),
        component: () => import("@/pages/Debug/debug.vue"),
    },
    {
        name: "layout",
        path: "/",
        redirect: "/home",
        meta: defineMeta({ level: 0 }),
        component: () => import("@/layout/Home.vue"),
        children: [
            {
                path: "/home",
                name: "home",
                meta: defineMeta({ level: 1, title: "首页" }),
                component: () => import("@/pages/home/home.vue"),
            },
        ],
    },
    {
        name: "404",
        path: "/404",
        meta: defineMeta({ title: "404" }),
        component: () => import("@/pages/NotPage/not-page.vue"),
    },
    {
        path: "*",
        redirect: "/404",
    },
];
const router = defineRouter(routes);

export function useRouter() {
    return router.core;
}

export function useRoute() {
    return router.core.currentRoute;
}

export const resetRoute = router.reset;

export default router;
