// 用户信息相关

import { defineStore } from "pinia";
import { ref } from "vue";
import {
  postUserLoginApi,
  getUserInfoApi,
  postUserLogoutApi,
} from "@/api/api.js";
import router from "@/routers";
import { useRouterStore } from "@/stores/useRouterStore";

export const useUserStore = defineStore(
  "user",
  () => {
    // 是否登录
    const isLogin = ref(false);

    // token
    const token = ref("");

    // 用户信息
    const userInfo = ref({
      id: "",
      username: "",
      password: "",
      role: {
        rights: [
          "/index",
          "/front/news/list",
          "/front/medicine/list",
          "/front/prescription/list",
          "/front/user"
        ],
      },
    });

    // 更新用户信息
    const changeUser = (value) => {
      userInfo.value = value;
    };

    /**
     * actions 登录时调用
     * @param {*} params
     */
    const loginAction = async (params) => {
      // 调用登录接口, 返回token
      try {
        const res = await postUserLoginApi(params);

        console.log(res);

        // 判断用户是否存在
        if (!!res) {
          const { id: userId, token: jwtToken } = res.data;

          // 存储token
          token.value = jwtToken;

          // 获取用户详细信息
          const userInfo = await getUserInfoApi();

          // 存储用户数据
          changeUser(userInfo.data);

          isLogin.value = true;

          ElMessage.success(res.msg);

          // 页面跳转
          if (
            userInfo.data.role.roleType === 302 ||
            userInfo.data.role.roleType === 303
          ) {
            router.push("/");
          } else {
            router.push("/layout");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    /**
     * actions 退出登录
     * @param {*} userId
     */
    const exitAction = async (userId) => {
      const { changeRouter } = useRouterStore();

      // 清除redis中的登录数据
      const res = await postUserLogoutApi(userId);

      // 更改登录状态
      isLogin.value = false;

      // 清空本地仓库与token
      token.value = "";
      userInfo.value = {
        id: "",
        username: "",
        password: "",
        role: {
          rights: [
            "/index",
            "/front/news/list",
            "/front/medicine/list",
            "/front/prescription/list",
            "/front/user"
          ],
        },
      };

      changeRouter(false);
      router.push("/login");
      ElMessage.success(res.msg);
    };

    return {
      token,
      userInfo,
      isLogin,
      changeUser,
      loginAction,
      exitAction,
    };
  },
  {
    // 配置项：持久化
    persist: true,
  }
);
