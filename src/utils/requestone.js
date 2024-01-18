import axios from "axios";
// import { Message } from "element-plus";
// import url from '@/config'
const service = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API}`,
  timeout: 500000
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (config) => {
    const res = config.data;
    if (res.code !== 200) {
      //   Message({
      //     message: res.message,
      //     type: "error"
      //   });
      // console.error(res.message);
      return Promise.reject("error");
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;
