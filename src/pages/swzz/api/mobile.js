import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";

// 移动云台接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const mobileServer = service.define({
    url: "http://server-addr:8088/VIID/ptz/ctrl/",
    method: "POST",
})

export function mobileObtain(props, viidToken) {
    mobileServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    mobileServer.server.config.bind("data", transFormData(props) || {})

    return mobileServer.obtain({ transResponse });
}
// export default queryServer