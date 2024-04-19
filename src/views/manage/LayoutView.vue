<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <SideMenu />
    </el-aside>

    <el-container direction="vertical">
      <el-header>
        <TopHeader />
      </el-header>

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

<style scoped>

.el-aside {
  background-color: #dff7dc;
}
</style>
