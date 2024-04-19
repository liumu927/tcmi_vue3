// 对axios进行二次封装

import axios from "axios";
import base from "./base";
import { useUserStore } from "@/stores/useUserStore";
import router from "@/routers";


const req = axios.create({
  baseURL: base.host,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 获取本地token
 * @returns 
 */
const getLocalToken = () => {
  const userStore = useUserStore();
  const token = userStore.token;

  return token;
};

// 请求拦截
req.interceptors.request.use(
  (config) => {
   const token =  getLocalToken();

    // 如果Token存在，将其添加到请求头中
    if (token) {
      // Bearer是一种HTTP认证方案
      config.headers.Authorization = token;
      // console.log(config);
    }

    return config;
  },
  (err) => {
    console.log(err);
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
      return res.data;
    }

    // 不成功
    if (!isSuccess) {
      ElMessage.error(res.data.msg);
    }
  },
  (error) => {
    // 处理登录过期的逻辑
    if (error.response.status === 401) {
      ElNotification.error(error.response.statusText);

      // 清除pinia和本地存储的信息
      localStorage.clear();

      // 跳转回管理员登录页
      router.push("/manage/login")

      //【待优化】token失效时，存在多个请求，会导致多次执行刷新token的接口
    }

    return Promise.reject(error);
  }
);

export default req;
