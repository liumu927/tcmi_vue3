// 对axios进行二次封装

import axios from "axios";
import base from "./base";
import { useUserStore } from "@/stores/useUserStore";

const req = axios.create({
  baseURL: base.host,
  timeout: 5000,
});

// 请求拦截
req.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()
    const token = await userStore.token;

    // 如果Token存在，将其添加到请求头中
    if(token) {
      // Bearer是一种HTTP认证方案
      config.headers.Authorization = token;
      // console.log(config);
    }


    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
req.interceptors.response.use(
  (res) => {
    console.log(res);

    const isSuccess = res.data.code === 200;

    // 成功
    if (isSuccess) {
      // ElMessage.success(res.data.msg);
      return res.data;
    }

    // 不成功
    if (!isSuccess) {
      ElMessage.warning(res.data.msg);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default req;
