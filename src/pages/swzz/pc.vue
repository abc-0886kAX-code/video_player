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
        <div class="video-url-slot">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video-url {
    width: 100%;
    height: 100%;
    // background-color: #ddd;
    overflow: hidden;

    &-slot {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    &-main {
        width: 100%;
        height: 100%;
        // pointer-events: none;
        overflow: hidden;
    }
}
</style>
