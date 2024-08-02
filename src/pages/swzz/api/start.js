import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";
// 销毁开启云台控制接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const startServer = service.define({
    url: "http://110.43.70.232:80/VIID/ptz/start/",
    method: "POST",
})

export function startObtain(props, viidToken) {
    startServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    startServer.server.config.bind("url", `http://110.43.70.232:80/VIID/ptz/start/${props.code}`)
    // destroyServer.server.config.bind("data", transFormData(props) || {})

    return startServer.obtain({ transResponse });
}
// export default queryServer