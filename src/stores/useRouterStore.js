// 创建路由

import { defineStore } from "pinia";
import { ref } from "vue";

// 用于记录是不是第一次进行路由拦截
export const useRouterStore = defineStore("router", () => {
  // isGetterRouter用于存储是否是第一次路由拦截，默认为false
  const isGetterRouter = ref(false);

  const changeRouter = (value) => {
    console.log(111);
    isGetterRouter.value = value;
  };

  return {
    isGetterRouter,
    changeRouter,
  };
});
