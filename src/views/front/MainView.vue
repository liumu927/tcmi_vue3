<template>
  <el-container class="common-layout" style="height: 100vh">
    <el-header>
      <NavMenu></NavMenu>
    </el-header>

    <el-container direction="vertical" style="margin-top: 60px">
      <el-main>
        <el-scrollbar>
          <!-- 二级路由出口: 显示内容 -->
          <router-view />
        </el-scrollbar>
      </el-main>

      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import NavMenu from "@/components/front/NavMenu.vue";
import Footer from "@/components/front/Footer.vue";
</script>

<style lang="scss" scoped>
.common-layout {
  min-height: 100%;
  // 容器为flex布局
  display: flex;
  // 方向为纵向，保持正常的从上到下文档流
  flex-direction: column;
  position: relative;

  // 设置顶部导航栏固定
  .el-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
  }

  Footer {
    // 设置footer的上外边距为auto
    margin-top: auto;
  }
}
</style>
