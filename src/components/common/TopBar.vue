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
  background: linear-gradient(to right,#2da32d,#5dd15d, #9ce09c);
  color: $theme-font-color;
  font-size: 20px;
  font-weight: bold;
  font-family: "楷体";
  display: flex;
  padding: 10px;
  align-items: center;
  position: relative; 

  & div:last-of-type {
    color: $theme-color;
    position: absolute;
    right: 20px;
  }
}
</style>
