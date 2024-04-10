<template>
  <div class="common-layout" style="height: 100vh">
    <el-container direction="vertical">
      <el-header>
        <NavMenu></NavMenu>
      </el-header>
      <el-main>
        <!-- 二级路由出口: 显示内容 -->
        <router-view />
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
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

  Footer {
    // 设置footer的上外边距为auto
    margin-top: auto;
  }
}
</style>
