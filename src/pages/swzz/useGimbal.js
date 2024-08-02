import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import axios from "axios";
import { useRoute } from "@/router/useRouter";
import { mergeObject } from "~/shared/merge";
import { queryServer, queryObtain } from './api/query'
import { mobileServer, mobileObtain } from './api/mobile'
import { destroyServer, destroyObtain } from './api/destroy'
import { startServer, startObtain } from './api/start'
import { Message } from 'element-ui';
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
    // 定义传递过来的参数
    const paramsData = computed(() => {
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
            // 数据请求成功
            if (res.ErrCode == 0) {
                // Status==0 空闲  
                // Status==1 连接状态   QueryUserCtrl==0 不是当前查询用户在控制   QueryUserCtrl==1  是当前查询用户在控制
                // Status==2 链接锁定状态  
                if (res.Result.Status == 1) {
                    if (res.Result.QueryUserCtrl == 0) {
                        Message({
                            showClose: true,
                            message: '其他人在控制云台，您当前不能进行云台控制',
                            type: 'warning'
                        });
                    }
                } else if (res.Result.Status == 2) {
                    Message({
                        showClose: true,
                        message: '链接锁定状态，您当前不能进行云台控制',
                        type: 'warning'
                    });
                } else {
                    startGimbal()
                }
            } else {
                Message({
                    showClose: true,
                    message: '查询云台状态失败',
                    type: 'error'
                });
            }

        })
    }
    // 开启云台
    const startGimbal = () => {
        startObtain({ code: unref(paramsData).code }, unref(paramsData).token).then((res) => {
            if (res.ErrCode != 0) {
                Message({
                    showClose: true,
                    message: '启动云台控制失败',
                    type: 'error'
                });
            }
        })
    }
    // 移动云台函数
    const mobileGimbal = (str) => {
        if (timer) {
            clearTimeout(timer);
        }
        // 获取到移动方向
        let Arr = moveObj.filter(item => item.name == str)
        // 开始云台移动
        mobileObtain(
            unref(paramsData).code,
            {
                PTZCmdID: Arr[0].start - 0,
                PTZCmdPara1: 3,
                PTZCmdPara2: 3,
                PTZCmdPara3: 0
            },
            unref(paramsData).token
        ).then((res) => {
        })
        timer = setTimeout(() => {
            // 结束云台移动
            mobileObtain(
                unref(paramsData).code,
                {
                    PTZCmdID: Arr[0].stop - 0,
                    PTZCmdPara1: 3,
                    PTZCmdPara2: 3,
                    PTZCmdPara3: 0
                },
                unref(paramsData).token
            ).then((res) => {
            })
        }, 2000)
    }

    // 停止云台控制函数
    const destroyGimbal = () => {
        destroyObtain({ code: unref(paramsData).code }, unref(paramsData).token).then((res) => {
            if (res.ErrCode != 0) {
                Message({
                    showClose: true,
                    message: '停止云台控制失败',
                    type: 'error'
                });
            }
        })
    }

    onMounted(() => {
    });

    (() => {
        // 离开当前页面进行停止控制云台控制
        destroyGimbal();
    })
    return { queryGimbal, mobileGimbal, destroyGimbal, startGimbal };
}
