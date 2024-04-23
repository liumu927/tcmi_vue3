// 对axios进行二次封装

import axios from "axios";
import base from "./base";
import { useTokenStore } from "@/stores/useTokenStore";
import router from "@/routers";
import { ElMessage } from "element-plus";

const req = axios.create({
  baseURL: base.host,
  timeout: 5000,
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

/**
 * 获取本地token
 * @returns
 */
const getLocalToken = () => {
  const { token } = useTokenStore();

  return token;
};

// 请求拦截
req.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    const token = getLocalToken();

    // 如果Token存在，将其添加到请求头中
    if (token) {
      // Bearer是一种HTTP认证方案
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log("🚀 ~ error:", error);

    return Promise.reject(error);
  }
);

// 响应拦截
req.interceptors.response.use(
  (res) => {
    // 对响应数据做点什么
    console.log("🚀 ~ res:", res);

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
    console.log("🚀 ~ error:", error);

    // 处理登录过期的逻辑
    if (error.response || error.response.status === 401) {
      // 根据后端设置的状态码

      ElNotification.error(error);

      // 清除过期 token
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 跳转到登录页
      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default req;
