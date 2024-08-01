import { useService } from "@/service/Application";
import { transFormData } from "~/shared/trans";

// 获取详情接口，返回code，token，url
const service = useService();
function transResponse(response) {

    const data = get(response, "data", {});
    return data;
}

export const detailServer = service.define({
    url: "",
    method: "POST",
})

export function detailObtain(props, viidToken) {
    detailServer.server.config.bind("headers", {
        Authorization: viidToken
    })
    detailServer.server.config.bind("data", transFormData(props) || {})

    return detailServer.obtain({ transResponse });
}
// export default queryServer