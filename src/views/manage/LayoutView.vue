<template>
  <el-container style="height: 100vh">
    <SideMenu></SideMenu>
    <el-container direction="vertical">
      <TopHeader></TopHeader>
      <el-main>
        <el-scrollbar>
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import SideMenu from "@/components/manage/SideMenu.vue";
import TopHeader from "@/components/manage/TopHeader.vue";
</script>

<style scoped></style>
