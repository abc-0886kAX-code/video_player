/*
 * @FilePath: \flv_player\src\main.js
 * @Author: maggot-code
 * @Date: 2022-11-21 14:19:59
 * @LastEditors: zhangxin
 * @LastEditTime: 2023-06-14 13:54:35
 * @Description:
 */
import Vue from "vue";
import { extendRouter } from "@/extend/router";
import { extendPinia } from "@/extend/pinia";
import { extendElement } from "@/extend/element";
import { extendScroll } from "@/extend/scroll";
import "./permission";
import App from "@/layout/App.vue";
import "normalize.css";
import "@/assets/style/index.scss";

const router = extendRouter(Vue);
const pinia = extendPinia(Vue);
extendElement(Vue);
extendScroll(Vue);
const app = new Vue({
    render: (h) => h(App),
    router,
    pinia,
});

app.$mount("#app");

export default app;
