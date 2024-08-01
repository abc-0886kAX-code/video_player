<!--
 * @FilePath: \video_player\src\pages\swzz-flv.vue
 * @Author: zhangxin
 * @Date: 2023-02-02 16:11:21
 * @LastEditors: zhangxin
 * @LastEditTime: 2024-07-23 11:10:11
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
        // http://192.144.218.174:9911/get/flv/hls/stream?url=rtsp://110.43.70.232:32554/58312
        // /get/flv/hls/stream?url=rtsp://rtspstream:af64f4a74947564c791f1e12d58361e9@zephyr.rtsp.stream/pattern
        url: "",
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
const { queryGimbal, mobileGimbal, destroyGimbal } = useGimbal(params);

const modifyLens = useThrottleFn((str) => {
    mobileGimbal(str);
}, 1000);
</script>

<template>
    <div class="video-url" v-loading="false">
        <div class="video-url-main">
            <video class="video-url-main-video" :style="videoStyle" ref="refs" muted="muted" autoplay="autoplay" loop="loop" controls></video>
            <!-- <iframe width="100%" height="100%" src="http://192.144.218.174:9911/flv/hls/stream?url=rtsp://rtspstream:af64f4a74947564c791f1e12d58361e9@zephyr.rtsp.stream/pattern"></iframe> -->
            <div class="video-url-main-title">
                <div class="video-url-main-title-name">张坊水文站云台控制</div>
                <div class="video-url-main-title-time">2024-07-23 15:44:38</div>
            </div>
        </div>

        <div class="video-url-slot">
            <div class="video-url-slot-compass">
                <div class="video-url-slot-compass-main"></div>
                <div class="video-url-slot-compass-top move_box" @click="modifyLens('top')">
                    <div></div>
                </div>
                <div class="video-url-slot-compass-left move_box" @click="modifyLens('left')">
                    <div></div>
                </div>
                <div class="video-url-slot-compass-bottom move_box" @click="modifyLens('bottom')">
                    <div></div>
                </div>
                <div class="video-url-slot-compass-right move_box" @click="modifyLens('right')">
                    <div></div>
                </div>
            </div>
            <div class="video-url-slot-lens">
                <div class="video-url-slot-lens-far" @click="modifyLens('far')">
                    <div>+</div>
                    <span>镜头拉远</span>
                </div>
                <div class="video-url-slot-lens-near" @click="modifyLens('near')">
                    <div class="video-url-slot-lens-minus"></div>
                    <span>镜头拉近</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video-url {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    padding: 24px;
    box-sizing: border-box;
    background: #0a2238;
    user-select: none; /* 防止文本被选中 */

    &-slot {
        width: 400px;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &-compass {
            width: 300px;
            height: 300px;
            border-radius: 300px;
            background: #071624;
            box-shadow: inset 0px 10px 16px 0px rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            > .move_box {
                width: 60px;
                height: 60px;
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            &-top {
                top: 20px;
                left: 120px;

                > div {
                    width: 0px;
                    height: 0px;
                    border-left: 24px solid transparent; /* 左边透明 */
                    border-right: 24px solid transparent; /* 右边透明 */
                    border-bottom: 40px solid #a5a5a5; /* 底边实心 */
                    border-radius: 6px;
                }
                > div:active {
                    border-bottom: 40px solid #042c60; /* 底边实心 */
                }
            }

            &-left {
                top: 120px;
                left: 20px;
                > div {
                    width: 0px;
                    height: 0px;
                    border-top: 24px solid transparent; /* 顶边透明 */
                    border-bottom: 24px solid transparent; /* 底边透明 */
                    border-right: 40px solid #a5a5a5; /* 右边实心 */
                    border-radius: 6px;
                }
                > div:active {
                    border-right: 40px solid #042c60; /* 右边实心 */
                }
            }
            &-bottom {
                bottom: 20px;
                left: 120px;
                > div {
                    width: 0px;
                    height: 0px;
                    border-left: 24px solid transparent; /* 左边透明 */
                    border-right: 24px solid transparent; /* 右边透明 */
                    border-top: 40px solid #a5a5a5; /* 顶边实心 */
                    border-radius: 6px;
                }
                > div:active {
                    border-top: 40px solid #042c60; /* 顶边实心 */
                }
            }
            &-right {
                top: 120px;
                right: 20px;
                > div {
                    width: 0px;
                    height: 0px;
                    border-top: 24px solid transparent; /* 顶边透明 */
                    border-bottom: 24px solid transparent; /* 底边透明 */
                    border-left: 40px solid #a5a5a5; /* 左边实心 */
                    border-radius: 6px;
                }
                > div:active {
                    border-left: 40px solid #042c60; /* 左边实心 */
                }
            }
            &-main {
                width: 110px;
                height: 110px;
                box-sizing: border-box;
                background: #071624;
                box-shadow: inset 0px 10px 16px 0px rgba(255, 255, 255, 0.2);
                border: solid 4px #a5a5a5;
                border-radius: 110px;
            }
        }
        &-lens {
            margin-top: 100px;
            width: 300px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            > div {
                width: 140px;
                height: 60px;
                background: #071624;
                border-radius: 30px;
                box-shadow: inset 0px 10px 16px 0px rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                > .video-url-slot-lens-minus {
                    width: 16px;
                    height: 2px;
                    background: #a5a5a5;
                }
                > div {
                    color: #a5a5a5;
                    font-size: 24px;
                    font-weight: 500;
                    margin-right: 12px;
                }
                > span {
                    color: #a5a5a5;
                    font-size: 18px;
                    font-weight: 500;
                }
            }
            &-far:active {
                background: #042c60;
            }
            &-near:active {
                background: #042c60;
            }
        }
    }

    &-main {
        width: calc(100% - 400px);
        height: 100%;
        // pointer-events: none;
        background: #071624;
        overflow: hidden;
        &-video {
            width: 100%;
            height: calc(100% - 100px);
            // pointer-events: none;
            overflow: hidden;
        }
        &-title {
            position: absolute;
            left: 24px;
            bottom: 24px;
            width: calc(100% - 448px);
            height: 100px;
            z-index: 9;
            padding: 12px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            color: #ffffff;
            &-name {
                font-size: 20px;
                font-weight: 500;
            }
            &-time {
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
}

// 去掉video标签底部样式
video::-webkit-media-controls-fullscreen-button {
    display: none;
}

video::-webkit-media-controls-play-button {
    display: none;
}

video::-webkit-media-controls-timeline {
    display: none;
}

video::-webkit-media-controls-current-time-display {
    display: none;
}

video::-webkit-media-controls-time-remaining-display {
    display: none;
}

video::-webkit-media-controls-mute-button {
    display: none;
}

video::-webkit-media-controls-toggle-closed-captions-button {
    display: none;
}

video::-webkit-media-controls-enclosure {
    display: none;
}

video::-webkit-media-controls-volume-slider {
    display: none;
}
</style>
