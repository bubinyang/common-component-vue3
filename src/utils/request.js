import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router";
// import { Message } from "element-plus";
// import url from '@/config'
const service = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API}/vi`,
  timeout: 500000
});

service.interceptors.request.use(
  (config) => {
    config.headers["X-Token"] = Cookies.get("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (config) => {
    const res = config.data;
    if (res.code !== 0) {
      //   Message({
      //     message: res.message,
      //     type: "error"
      //   });
      console.error(res.message);
      if (res.code === 1000) {
        Cookies.remove("token");
        router.replace("/login");
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log(error, "error");
    return Promise.reject(error);
  }
);
export default service;
