// 对axios进行二次封装

import axios from "axios";
import base from "./base";
import { useTokenStore } from "@/stores/useTokenStore";
import router from "@/routers";

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

/**
 * 移除本地token
 */
const removeLocalToken = () => {
  const { removeToken } = useTokenStore();

  removeToken();
};

// 请求拦截
req.interceptors.request.use(
  (config) => {
    const token = getLocalToken();

    // 如果Token存在，将其添加到请求头中
    if (token) {
      // Bearer是一种HTTP认证方案
      config.headers.Authorization = token;
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
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;

      // 判断是否正在刷新 Token
      if (!isRefreshing) {
        isRefreshing = true;

        // 发送刷新 Token 的请求
        refreshToken()
          .then((response) => {
            const { token } = response.data;

            // 更新本地存储的 Token
            useTokenStore().setToken(token);

            // 重新发送队列中的所有请求
            reSendQueue();

            // 清空队列
            refreshQueue = [];
          })
          .catch(() => {
            // 刷新 Token 失败，需要重新登录
            redirectToLogin();
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      // 将当前请求放入队列中
      return addToQueue(originalRequest);
    }

    return Promise.reject(error);
  }
);

// 刷新 Token 的函数
function refreshToken() {
  // 实现刷新 Token 的逻辑，返回一个 Promise
}

// 重新发送队列中的请求
function reSendQueue() {
  refreshQueue.forEach((request) => {
    req(request)
      .then((response) => {
        request.resolve(response);
      })
      .catch((error) => {
        request.reject(error);
      });
  });
}

// 将请求加入队列
function addToQueue(request) {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ request, resolve, reject });
  });
}

// 重定向到登录页面
function redirectToLogin() {
  ElNotification.error("登录过期[请重新登录]");

  // 清除pinia和本地存储的信息
  localStorage.clear();

  // 跳转
  router.push("/");
}

export default req;
