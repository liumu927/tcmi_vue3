// 创建路由

import { defineStore } from "pinia";
import { ref } from "vue";

// 用于记录是不是第一次进行路由拦截
export const useRouterStore = defineStore("router", () => {
  // 状态：全局可用
  // 含义：是否创建过路由
  const isGetterRouter = ref(false);

  const changeRouter = (value) => {
    isGetterRouter.value = value;
  };

  return {
    isGetterRouter,
    changeRouter,
  };
});
