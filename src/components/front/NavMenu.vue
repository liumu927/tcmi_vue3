<template>
  <el-menu
    :default-active="route.fullPath"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#4e8958"
    active-text-color="#ffd04b"
    text-color="#fff"
    :router="true"
  >
    <div class="title">百草</div>
    <template v-for="data in datalist" :key="data.path">
      <!-- 含多级菜单 -->
      <el-menu-item v-if="data.children.length && checkAuth(data.path)">
        <!-- 头像框 -->
        <el-avatar :size="38" :src="circleUrl" @click="dialog = true" />
        <!-- 抽屉显示子菜单 -->
        <el-drawer v-model="dialog" direction="rtl" size="40%">
          <!-- 自定义抽屉标题 -->
          <template #header="{ titleId, titleClass }">
            <div>
              <el-avatar :src="circleUrl" />
              <p :id="titleId" :class="titleClass">
                <template v-if="!isLogin">尚未登录的拾草客</template>
                <template v-else>
                  尊贵的【{{ userInfo.username }}】大人
                </template>
              </p>
            </div>
          </template>

          <!-- 二级菜单项 -->
          <template v-for="item in data.children" :key="item.path">
            <el-menu-item
              :index="item.path"
              v-if="checkAuth(item.path)"
              @click="dialog = false"
            >
              <el-icon>
                <component :is="mapIcon[item.icon]"></component>
              </el-icon>
              <p>{{ item.title }}</p>
            </el-menu-item>
          </template>

          <!-- 判断是否登录 -->
          <el-button v-if="!isLogin" type="success" @click="handleLogin"
            >去登录</el-button
          >
          <el-button v-else type="danger" @click="handleExit"
            >退出登录</el-button
          >

          <el-button @click="handleManage">进入后台</el-button>
        </el-drawer>
      </el-menu-item>
      <!-- 仅有一级菜单 -->
      <el-menu-item :index="data.path" v-else-if="checkAuth(data.path)">
        <p>{{ data.title }}</p>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getFrontRightsApi } from "@/api/api.js";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter, useRoute } from "vue-router";
import {
  ChatDotRound,
  User,
  Star,
  SwitchButton,
  Upload,
  Postcard,
} from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";

const { exitAction, userInfo } = useUserStore();
const { isLogin } = storeToRefs(useUserStore());

const router = useRouter();
// 当前路由对象
const route = useRoute();
// vite环境 资源在public时
const circleUrl = "/avatar.png";
// 存储请求回来的数据
const datalist = ref([]);
// 弹出抽屉
const dialog = ref(false);
// 映射图标
const mapIcon = { ChatDotRound, User, Star, SwitchButton, Upload, Postcard };

onMounted(() => {
  getFrontRights();
});

/**
 * 获取导航栏数据
 */
const getFrontRights = async () => {
  try {
    // 在配置文件中 使用反向代理 解决跨域 【该配置已经无法解决问题，直接在后端配置了注解】【前后端都配置了cors跨域】
    var res = await getFrontRightsApi("front");

    datalist.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 用一个短暂的延迟切换对话框【备用，目前不设置该项也可以】
// const handleOpenDrawer = (key, keyPath) => {
//   console.log(key, keyPath);
//   setTimeout(() => {
//     // 使用 Promise 来处理延迟更新
//     new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
//       dialog.value = !dialog.value;
//       console.log(33333, dialog.value);
//     });
//   }, 10); // 根据需要调整延迟
// };

/**
 * 登录
 */
const handleLogin = () => {
  if (!isLogin.value) {
    router.push("/login");
  } else {
    alert("您已经登录！");
  }
};

/**
 * 进入后台
 */
const handleManage = () => {
  // 未登录：跳转后台登录页
  if (!isLogin.value) {
    router.push("/manage/login");
  } else if (userInfo.role.roleType === 300 || userInfo.role.roleType === 301) {
    // 直接通往后台
    router.push("/manage/home");
  } else {
    // 普通/专业用户无法进入后台登录页
    alert("对不起，您没有访问后台的权限！");
  }
};

// 退出登录
const handleExit = () => {

  // 在pinia中进行退出操作：清除用户信息
  exitAction(userInfo.id);

  // 关闭抽屉
  dialog.value = false;
};

// 根据身份对应权限渲染列表
const checkAuth = (path) => {
  return userInfo.role.rights.includes(path);
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 左侧标题
  .title {
    color: $theme-font-color;
    font-size: 32px;
    font-weight: bold;
    font-family: "楷体";
    margin: 20px;
  }
  .el-menu-item:hover {
    color: $theme-font-color !important;
  }
  // 右侧头像
  .el-drawer .el-avatar {
    margin: 20px;
  }
  // 抽屉标题区
  :deep(.el-drawer) {
    background-color: rgba($color: $theme-color, $alpha: 0.6);
    .el-drawer__header {
      margin-bottom: 0;
      // 头像框
      .el-avatar {
        float: left;
      }
      // 姓名条
      .el-drawer__title {
        color: #fff;
        height: 80px;
        line-height: 80px;
        margin: 0 20px;
      }
    }
    .el-button {
      margin: 20px;
    }
  }
}
</style>
