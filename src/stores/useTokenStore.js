/**
 * Token 相关
 */

import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore(
  "token",
  () => {
    // 响应式变量
    const token = ref("");

    // 修改token
    const setToken = (newToken) => {
      token.value = newToken;
    };

    // 移除token
    const removeToken = () => {
      token.value = "";
    };

    return {
      token,
      setToken,
      removeToken,
    };
  },
  {
    // 配置项：持久化
    persist: true,
  }
);
