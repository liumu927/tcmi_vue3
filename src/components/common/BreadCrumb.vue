<!-- 面包屑导航 -->

<template>
  <div class="bread">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item
        v-for="(item, index) in breadList"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.meta.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 路由集合
const breadList = ref([]);

watch()
</script>

<style lang="scss" scoped></style>
