// 用户信息相关

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { postUserLogin, getUserInfoApi } from "@/api/api.js";
import router from "@/routers";

export const useUserStore = defineStore(
  "user",
  () => {
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
          "/front/user",
          "/manage/login",
        ],
      },
    });

    // getters 登录标志 判断用户是否登录成功
    const isLogin = computed(() => {
      return !!userInfo.value.id;
    });

    // 更新用户信息
    const changeUser = (value) => {
      userInfo.value = value;
    };

    // actions 登录时调用
    const loginAction = async (params) => {
      // 调用登录接口, 返回token
      try {
        const res = await postUserLogin(params);

        // console.log(res);

        // 判断用户是否存在
        if (!!res) {
          const { id: userId, token: jwtToken } = res.data;

          // 存储token
          token.value = jwtToken;


          // 获取用户详细信息
          const userInfo = await getUserInfoApi();

          // console.log(userInfo);

          // 存储用户数据
          changeUser(userInfo.data)

          // 页面跳转
          if(userInfo.data.role.roleType === 302 || userInfo.data.role.roleType === 303) {
            router.push('/');
          } else {
            router.push('/layout');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    // actions 退出登录
    const exitAction = async () => {
      // 清空仓库
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
            "/front/user",
            "/manage/login",
          ],
        },
      };

      router.push("/");
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
