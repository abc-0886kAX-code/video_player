<!--
 * @FilePath: \flv_player\src\pages\video-m3u8.vue
 * @Author: zhangxin
 * @Date: 2023-01-17 16:49:31
 * @LastEditors: zhangxin
 * @LastEditTime: 2023-06-14 14:02:54
 * @Description:
-->
<script setup>
import videojs from 'video.js/dist/video.min'
import 'video.js/dist/video-js.css';
import { useElementRefs } from '@/hooks/useElement';
const { refs, ready } = useElementRefs();
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";

// http://118.178.243.29:8888/K68220015/index.m3u8
const route = useRoute();
const params = computed(()=>{
    return mergeObject({
        url:'',
    },route.query)
})
const videoEntity = ref(null);

// 初始化视频
function initVideo() {
    videojs(unref(refs), {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controlBar: false
    }, () => {
        videoEntity.value = videojs(unref(refs))
        videoEntity.value.src([
            {
                type: "application/x-mpegURL",
                src: unref(params).url
            }
        ])
        videoEntity.value.play()
        videoEntity.value.on('error', () => { })
        console.log(videoEntity.value);
    })
}

function disposeVideo() {
    if (isNil(unref(videoEntity))) return;
    videoEntity.value.dispose();
}


watch(refs, () => unref(ready) && initVideo(), { immediate: true });

onBeforeUnmount(() => {
    disposeVideo()
})
</script>

<template>
    <div class="video-m3u8">
        <video ref="refs" controls="controls" muted="muted" autoplay="autoplay" loop="loop"></video>
    </div>
</template>

<style scoped lang='scss'>
.video-m3u8 {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
