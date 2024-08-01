import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import axios from "axios";
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";
import { queryServer, queryObtain } from './api/query'
import { mobileServer, mobileObtain } from './api/mobile'
import { destroyServer, destroyObtain } from './api/destroy'
const route = useRoute();

/**
* 发送云台控制指令
* PTZCmdID {
*  转向中上 1026 开始  1025 停止
*  转向右上 2050 开始  2049 停止
*  转向右中 1282 开始  1281 停止
*  转向右下 2052 开始  2051 停止
*  转向中下 1028 开始  1027 停止
*  转向左下 1796 开始  1795 停止
*  转向左中 1284 开始  1283 停止
*  转向左上 1794 开始  1793 停止
*  变倍放大 770  开始  769  停止
*  变倍缩小 772  开始  771  停止
*  对焦放大 516  开始  515  停止
*  对焦缩小 514  开始  513  停止
* }
*/
const moveObj = [{
    start: '1026',
    stop: '1025',
    name: 'top'
}, {
    start: '1282',
    stop: '1281',
    name: 'right'
}, {
    start: '1028',
    stop: '1027',
    name: 'bottom'
}, {
    start: '1284',
    stop: '1283',
    name: 'left'
}, {
    start: '514',
    stop: '513',
    name: 'far'
}, {
    start: '516',
    stop: '515',
    name: 'near'
}]



export function useGimbal(params) {
    const paramsData = computed(() => {
        console.log(console.log(params));
        return mergeObject(
            {
                url: '',
                code: '',
                token: ''
            },
            unref(params)
        );
    })
    let timer = null;
    // 查询云台
    const queryGimbal = () => {

        queryObtain({ code: unref(paramsData).code }, unref(paramsData).token).then((res) => {
            console.log(res, "获取云台信息");
        })

    }
    // 移动云台
    const mobileGimbal = (str) => {
        if (timer) {
            clearTimeout(timer);
        }
        let Arr = moveObj.filter(item => item.name == str)
        console.log(Arr[0], "Obj.start");
        mobileObtain(
            {
                code: unref(paramsData).code,
                PTZCmdID: Arr[0].start,
                PTZCmdPara1: 3,
                PTZCmdPara2: 3,
                PTZCmdPara3: 0
            },
            unref(paramsData).token
        )
        timer = setTimeout(() => {
            mobileObtain(
                {
                    code: unref(paramsData).code,
                    PTZCmdID: Arr[0].stop,
                    PTZCmdPara1: 3,
                    PTZCmdPara2: 3,
                    PTZCmdPara3: 0
                },
                unref(paramsData).token
            )
        }, 2000)
    }

    // 销毁云台
    const destroyGimbal = () => {
        destroy({ code: unref(paramsData).code }, unref(paramsData).token)
    }

    onMounted(() => {
    });
    onUnmounted(() => {
        console.log("页面销毁");
    })
    return { queryGimbal, mobileGimbal, destroyGimbal };
}
