<template>
  <div class="header">
    <p class="title">中 医 药 信 息 管 理 系 统 后 台</p>
    <div>
      <p class="tip">欢迎 {{ userInfo.role.roleName }} 回来 🤗</p>
      <el-dropdown>
        <div class="el-dropdown-link">
          <!-- 头像框 -->
          <el-avatar :size="35" :src="userInfo.avatar">
            <img :src="circleUrl">
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled
              >尊贵的 {{ userInfo.username }} 大人</el-dropdown-item
            >
            <el-dropdown-item @click="handleSwitch"
              >去往前台😊</el-dropdown-item
            >
            <el-dropdown-item @click="handleExit">退出登录😭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "vue-router";

const { exitAction, userInfo } = useUserStore();
const router = useRouter();
// vite环境 资源在public时
const circleUrl = "/avatar.png";

// 切换前台
const handleSwitch = () => {
  router.push("/index");
};

// 后台：退出登录
const handleExit = () => {
  // 在pinia中进行退出操作：清除用户信息
  exitAction(userInfo.id);
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $theme-color;
  color: #fff;
  padding: 0 20px;
  font-weight: bold;
  font-size: 16px;

  .title {
    float: left;
  }
  .tip {
    line-height: 50px;
    float: left;
    margin-right: 10px;
  }

  .el-dropdown {
    height: 50px;
    display: flex;
    align-items: center;

    // 头像框
    // &.el-dropdown-link {
    //   cursor: pointer;
    //   // 去除黑框
    //   outline: none;
    // }
  }
}
</style>
