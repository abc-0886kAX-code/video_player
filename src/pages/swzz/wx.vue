<!--
 * @FilePath: \video_player\src\pages\swzz\wx.vue
 * @Author: zhangxin
 * @Date: 2023-02-02 16:11:21
 * @LastEditors: zhangxin
 * @LastEditTime: 2024-07-24 10:17:06
 * @Description:
-->
<script setup>
import { useElementRefs } from "@/hooks/useElement";
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";
import flvjs from "flv.js";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import { useGimbal } from "./useGimbal.js";
// useDebounceFn 防抖函数
// useThrottleFn 节流函数
const { refs, ready } = useElementRefs();
const route = useRoute();
const params = computed(() => {
    return mergeObject(
        {
            url: "",
            code: "",
            token: "",
            fit: "contain",
        },
        route.query
    );
});
// 解构出自定义云台控制函数
const { queryGimbal, mobileGimbal, destroyGimbal } = useGimbal(params);
const flvPlayer = ref(null);
const loading = ref(true);
const videoStyle = computed(() => {
    return {
        "object-fit": unref(params).fit,
    };
});
async function defineVideo() {
    loading.value = true;
    flvPlayer.value = flvjs.createPlayer({
        type: "flv",
        isLive: true,
        hasAudio: false,
        url: decodeURIComponent(unref(params).url),
    });
    flvPlayer.value.attachMediaElement(unref(refs));
    flvPlayer.value.load();
    flvPlayer.value.play();
    flvPlayer.value.on(flvjs.Events.ERROR, (error) => {
        console.log(error);
        loading.value = false;
    });
    loading.value = false;
}

watch(ready, (state) => {
    if (state && flvjs.isSupported() && isNil(unref(flvPlayer))) defineVideo();
});
onMounted(() => {
    loading.value = true;
    queryGimbal();
});
onUnmounted(() => {
    if (isNil(unref(flvPlayer))) return;

    unref(flvPlayer).pause();
    unref(flvPlayer).unload();
    // unref(flvPlayer).detachMediaElement();
    unref(flvPlayer).destroy();

    loading.value = false;
    flvPlayer.value = null;
});
// 设置点击云台控制按钮绑定上防抖函数
const modifyLens = useThrottleFn((str) => {
    mobileGimbal(str);
}, 1000);
</script>

<template>
    <div class="video-url" v-loading="loading">
        <video class="video-url-main" :style="videoStyle" ref="refs" muted="muted" autoplay="autoplay" loop="loop" controls></video>
        <div class="video-url-holder">
            <div class="video-url-holder-title">
                <div class="video-url-holder-title-icon"></div>
                <div class="video-url-holder-title-context">张坊水文站云台控制</div>
            </div>
            <div class="video-url-holder-console">
                <div class="video-url-holder-console-ring">
                    <div class="triangle up" @click="modifyLens('top')"></div>
                    <div class="triangle down" @click="modifyLens('bottom')"></div>
                    <div class="triangle left" @click="modifyLens('left')"></div>
                    <div class="triangle right" @click="modifyLens('right')"></div>
                </div>
            </div>
            <div class="video-url-holder-button">
                <div class="video-url-holder-button-item" @click="modifyLens('far')">
                    <div class="icon plus"></div>
                    镜头拉远
                </div>
                <div class="video-url-holder-button-item" @click="modifyLens('near')">
                    <div class="icon minus"></div>
                    镜头拉近
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video-url {
    width: 100%;
    height: 100%;
    // background-color: #ddd;
    overflow: hidden;
    user-select: none; /* 防止文本被选中 */

    &-main {
        width: 100%;
        height: 40%;
        // pointer-events: none;
        overflow: hidden;
    }

    &-holder {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 70%;
        overflow: hidden;
        border-radius: 30px 30px 0 0;
        background-color: #f6f6f6;
        z-index: 999;

        &-title {
            height: 10%;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 8%;
            box-sizing: border-box;

            &-icon {
                width: 1%;
                height: 1.2rem;
                background-color: #1384ec;
            }

            &-context {
                margin-left: 1rem;
                font-size: 1.2rem;
            }
        }

        &-console {
            height: 70%;
            width: 100%;
            border-top: 1px solid #eeeeee;
            display: flex;
            align-items: center;
            justify-content: center;

            &-ring {
                width: 65%;
                height: 60%;
                border-radius: 50%;
                background: -webkit-radial-gradient(circle closest-side, #f6f6f6 50%, #ffffff 50%);
                position: relative;
                box-shadow: inset 0 5px 8px 6px rgba(238, 238, 238, 0.6), 0 10px 10px 6px rgba(238, 238, 238, 0.8);
                .triangle {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    cursor: pointer;
                    /* 添加鼠标指针样式以表示可点击 */
                }

                .triangle.up {
                    top: 10%;
                    left: 50%;
                    margin-left: -14px;
                    border-width: 0 14px 20px 14px;
                    border-color: transparent transparent #262626 transparent;
                    border-radius: 6px;
                }

                .triangle.down {
                    bottom: 10%;
                    left: 50%;
                    margin-left: -14px;
                    border-width: 20px 14px 0 14px;
                    border-color: #262626 transparent transparent transparent;
                    border-radius: 6px;
                }

                .triangle.left {
                    top: 50%;
                    left: 10%;
                    margin-top: -14px;
                    border-width: 14px 20px 14px 0;
                    border-color: transparent #262626 transparent transparent;
                    border-radius: 6px;
                }

                .triangle.right {
                    top: 50%;
                    right: 10%;
                    margin-top: -14px;
                    border-width: 14px 0 14px 20px;
                    border-color: transparent transparent transparent #262626;
                    border-radius: 6px;
                }
            }

            &-ring::before {
                content: "";
                position: absolute;
                top: 25%;
                left: 25%;
                width: 50%;
                height: 50%;
                border-radius: 50%;
                background: #f6f6f6;
                box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                /* 内圆阴影 */
            }
        }

        &-button {
            width: 100%;
            height: 20%;
            display: flex;
            justify-content: space-between;
            padding: 0 8%;
            box-sizing: border-box;
            text-align: center;

            &-item {
                line-height: 3rem;
                width: 40%;
                height: 40%;
                background-color: #fff;
                border-radius: 100px;
                box-shadow: inset 0 5px 8px 6px rgba(238, 238, 238, 0.3), 0 10px 10px 6px rgba(238, 238, 238, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
                cursor: pointer;
            }

            .icon {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                position: relative;
            }

            .plus::before,
            .plus::after,
            .minus::before {
                content: "";
                position: absolute;
                background-color: #000;
            }

            .plus::before,
            .minus::before {
                width: 100%;
                height: 2px;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
            }

            .plus::after {
                width: 2px;
                height: 100%;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
}
</style>
