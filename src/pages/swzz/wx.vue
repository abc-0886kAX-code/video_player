<!--
 * @FilePath: \video_player\src\pages\swzz\wx.vue
 * @Author: zhangxin
 * @Date: 2023-02-02 16:11:21
 * @LastEditors: zhangxin
 * @LastEditTime: 2024-07-23 17:42:15
 * @Description:
-->
<script setup>
import { useElementRefs } from "@/hooks/useElement";
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";
import flvjs from 'flv.js';

const { refs, ready } = useElementRefs();
const route = useRoute();
const params = computed(() => {
    return mergeObject({
        url: '',
        fit: 'contain'
    }, route.query)
})
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
    if (state && flvjs.isSupported() && isNil(unref(flvPlayer)))
        defineVideo();
});
onMounted(() => {
    loading.value = true;
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
</script>

<template>
    <div class="video-url" v-loading="loading">
        <video class="video-url-main" :style="videoStyle" ref="refs" muted="muted" autoplay="autoplay" loop="loop"
            controls></video>
        <div class="video-url-holder">
            <div class="video-url-holder-title">
                <div class="video-url-holder-title-icon"></div>
                <div class="video-url-holder-title-context">张坊水文站云台控制</div>
            </div>
            <div class="video-url-holder-console">
                <div class="video-url-holder-console-ring">
                    <div class="triangle up" onclick="handleClick('up')"></div>
                    <div class="triangle down" onclick="handleClick('down')"></div>
                    <div class="triangle left" onclick="handleClick('left')"></div>
                    <div class="triangle right" onclick="handleClick('right')"></div>
                </div>

            </div>
            <div class="video-url-holder-button"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video-url {
    width: 100%;
    height: 100%;
    // background-color: #ddd;
    overflow: hidden;

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
        background-color: #F6F6F6;
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
                background-color: #1384EC;
            }

            &-context {
                margin-left: 1rem;
                font-size: 1.2rem;
            }
        }

        &-console {
            height: 70%;
            width: 100%;
            border-top: 1px solid #EEEEEE;
            display: flex;
            align-items: center;
            justify-content: center;

            &-ring {
                width: 65%;
                height: 60%;
                border-radius: 50%;
                background: -webkit-radial-gradient(circle closest-side, #F6F6F6 50%, #FFFFFF 50%);
                position: relative;
                box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);

                /* 外圆阴影 */
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
                    margin-left: -10px;
                    border-width: 0 10px 20px 10px;
                    border-color: transparent transparent #262626 transparent;
                }

                .triangle.down {
                    bottom: 10%;
                    left: 50%;
                    margin-left: -10px;
                    border-width: 20px 10px 0 10px;
                    border-color: #262626 transparent transparent transparent;
                }

                .triangle.left {
                    top: 50%;
                    left: 10%;
                    margin-top: -10px;
                    border-width: 10px 20px 10px 0;
                    border-color: transparent #262626 transparent transparent;
                }

                .triangle.right {
                    top: 50%;
                    right: 10%;
                    margin-top: -10px;
                    border-width: 10px 0 10px 20px;
                    border-color: transparent transparent transparent #262626;
                }
            }

            &-ring::before {
                content: '';
                position: absolute;
                top: 25%;
                left: 25%;
                width: 50%;
                height: 50%;
                border-radius: 50%;
                background: #F6F6F6;
                box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                /* 内圆阴影 */
            }
        }

        &-button {
            width: 100%;
            height: 20%;
            background-color: palegreen
        }
    }
}
</style>
