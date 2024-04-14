import { SA_API_URL, SA_API_TOKEN } from '@/config'
import axios, {AxiosResponse} from "axios";

export const authSpeedyAgencyMember = (mobile: string) => {
    const http = axios.create({
        timeout: 30000,
    });

    return http.post(`${SA_API_URL}/member/auth`,{
        mobile,
    },{
        headers: {
            Authorization: SA_API_TOKEN,
        },
    }).then((resp: AxiosResponse<{
        status: boolean,
        error?: {
            msg: string,
        },
        data?: {
            company: string,
        }
    }>) => {
        const data = resp.data;

        if (!data.status) {
            return Promise.reject(new Error(data.error?.msg || "member login failed"))
        }
        return Promise.resolve(data.data?.company);
    }).catch((error) => {
        console.log(error);
        return Promise.reject(error)
    })
}
