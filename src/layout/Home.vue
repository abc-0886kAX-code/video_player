<!--
 * @FilePath: \vue2.7_template\src\layout\Home.vue
 * @Author: zhangxin
 * @Date: 2023-04-12 13:14:28
 * @LastEditors: zhangxin
 * @LastEditTime: 2023-05-05 17:03:19
 * @Description:
-->
<script setup>
import Weather from "@/components/weather/weather.vue";
import { useUserStore } from "@/store/useUser";
const { proxy } = getCurrentInstance();
const user = useUserStore();
function handleUser(params) {}
function handleCommand(command) {
    command === "userLogout" && userLogout();
}
function userLogout() {
    user.emptyUserInfo();
    proxy.$router.push({ name: "login" });
}
</script>

<template>
    <el-container class="home">
        <el-header class="home-header">
            <div class="home-header-weather">
                <Weather></Weather>
            </div>
            <el-dropdown class="home-header-user" size="small" split-button type="primary" @command="handleCommand" @click="handleUser">
                用户名称
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="userLogout">注销登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>

        <el-container class="home-main">
            <el-main class="home-main-content">
                <transition name="el-fade-in-linear">
                    <router-view />
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped lang="scss">
.home {
    background-color: transparent;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &-header {
        display: flex;
        justify-content: space-between;
        z-index: 1;
        background-color: #afc4cf;
        &-weather {
            height: 100%;
        }
        &-user {
            height: 100%;
            width: auto;
            display: flex;
            align-items: center;
        }
        img {
            width: 400px;
            height: 30px;
            font-size: 0;
            overflow: hidden;
            margin-top: 15px;
        }
    }
    &-main {
        position: relative;
        z-index: 1;
        width: 100%;
        height: calc(100% - 80px);
        overflow: hidden;
        box-sizing: border-box;
        &-content {
            width: 100%;
            height: 100%;
            padding: 0 !important;
        }
    }
}
</style>
