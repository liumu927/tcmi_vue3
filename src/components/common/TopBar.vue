<!-- 通用头 -->
<template>
  <el-header>
    <div class="left">中医药信息管理平台</div>
    <div class="right">百草</div>
  </el-header>
</template>

<script setup></script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-header {
  background-color: $theme-color;
  color: $theme-font-color;
  font-size: 32px;
  font-weight: bold;
  font-family: "楷体";
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative; 

  & div:last-of-type {
    position: absolute;
    right: 20px;
  }
}
</style>
