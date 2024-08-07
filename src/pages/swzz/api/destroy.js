import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";
// 销毁云台控制接口
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const destroyServer = service.define({
    url: "http://110.43.70.232:80/VIID/ptz/release/",
    method: "POST",
})

export function destroyObtain(props, viidToken) {
    destroyServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    destroyServer.server.config.bind("url", `http://110.43.70.232:80/VIID/ptz/release/${props.code}`)
    // destroyServer.server.config.bind("data", transFormData(props) || {})

    return destroyServer.obtain({ transResponse });
}
// export default queryServer