<!--
 * @FilePath: \flv_player\src\pages\video-flv.vue
 * @Author: zhangxin
 * @Date: 2023-02-02 16:11:21
 * @LastEditors: zhangxin
 * @LastEditTime: 2023-06-14 14:10:33
 * @Description:
-->
<script setup>
import { useElementRefs } from "@/hooks/useElement";
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";

const { refs, ready } = useElementRefs();
const route = useRoute();
const params = computed(()=>{
    return mergeObject({
        url:'',
        fit:'contain'
    },route.query)
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
    flvPlayer.value = window.flvjs.createPlayer({
        type: "flv",
        isLive: true,
        hasAudio: false,
        url: unref(params).url,
    });
    flvPlayer.value.attachMediaElement(unref(refs));
    flvPlayer.value.load();
    flvPlayer.value.play();
    flvPlayer.value.on(window.flvjs.Events.ERROR, (error) => {
        console.log(error);
        loading.value = false;
    });
    loading.value = false;
}

watch(ready, (state) => {
    if (state && window.flvjs.isSupported() && isNil(unref(flvPlayer)))
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
