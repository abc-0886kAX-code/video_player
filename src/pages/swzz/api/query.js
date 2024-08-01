/*
 * @FilePath: \video_player\src\pages\swzz\api\query.js
 * @Author: zhangxin
 * @Date: 2024-08-01 17:12:37
 * @LastEditors: zhangxin
 * @LastEditTime: 2024-08-01 17:24:54
 * @Description:
 */
import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";

// 查询云台控制权接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const queryServer = service.define({
    url: "http://110.43.70.232:80/VIID/ptz/status/",
    method: "GET",
})

export function queryObtain(props, viidToken) {
    queryServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    queryServer.server.config.bind("url", `http://110.43.70.232:80/VIID/ptz/status/${props.code}`)
    queryServer.server.config.bind("params", props)

    return queryServer.obtain({ transResponse });
}
// export default queryServer
