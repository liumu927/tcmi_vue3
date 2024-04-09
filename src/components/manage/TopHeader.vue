<template>
  <el-header>
    <div class="title">中 医 药 信 息 管 理 系 统 后 台</div>
    <div>
      <p class="tip">欢迎 {{ userInfo.role.roleName }} 回来 🤗</p>
      <el-dropdown>
        <div class="el-dropdown-link">
          <!-- 头像框 -->
          <el-avatar :size="38" :src="circleUrl" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled
              >尊贵的 {{ userInfo.username }} 大人</el-dropdown-item
            >
            <el-dropdown-item @click="handleSwitch"
              >去往前台😊</el-dropdown-item
            >
            <el-dropdown-item @click="handleExit">退出后台😭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { useRouterStore } from "@/stores/useRouterStore";
import { useRouter } from "vue-router";

const { exitAction, userInfo } = useUserStore();
const { changeRouter } = useRouterStore();
const router = useRouter();
// vite环境 资源在public时
const circleUrl = "/avatar.png";

// webpack环境 资源在src->assets时
// const circleUrl = require('@/assets/avatar.png')
// vite环境 资源在src->assets时
// const circleUrl = new URL('@/assets/avatar.png', import.meta.url)

// 切换前台
const handleSwitch = () => {
  router.push("/index");
};

// 后台：退出登录
const handleExit = () => {
  // 【问题】这里不生效了
  // changeRouter(false);

  // 在pinia中进行退出操作：清除用户信息
  exitAction();
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-header {
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
    line-height: 38px;
    float: left;
    margin-right: 10px;
  }
  // 头像框
  .el-dropdown-link {
    cursor: pointer;
    // 去除黑框
    outline: none;
  }
}
</style>
