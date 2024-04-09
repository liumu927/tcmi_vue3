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

<style lang="scss" scoped></style>
