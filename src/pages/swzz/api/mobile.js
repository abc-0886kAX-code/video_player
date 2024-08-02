import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";

// 移动云台接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const mobileServer = service.define({
    url: "http://110.43.70.232:80/VIID/ptz/ctrl/",
    method: "POST",
})

export function mobileObtain(code, props, viidToken) {
    mobileServer.server.config.bind("headers", {
        Authorization: viidToken,
        'Content-Type': 'application/json'
    })
    console.log('====================================');
    console.log(JSON.stringify(props), "JSON.stringify(props)");
    console.log('====================================');
    // mobileServer.server.config.bind("contentType", 'application/json')
    mobileServer.server.config.bind("url", `http://110.43.70.232:80/VIID/ptz/ctrl/${code}`)
    mobileServer.server.config.bind("data", props)

    return mobileServer.obtain({ transResponse });
}
// export default queryServer
