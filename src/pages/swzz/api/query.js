import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";

// 查询云台控制权接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const queryServer = service.define({
    url: "http://server-addr:8088/VIID/ptz/status/",
    method: "GET",
})

export function queryObtain(props, viidToken) {
    queryServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    queryServer.server.config.bind("data", transFormData(props) || {})

    return queryServer.obtain({ transResponse });
}
// export default queryServer