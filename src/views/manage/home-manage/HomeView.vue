<template>
  <div style="color: #666; font-size: 14px">
    <el-card>
      <!-- 头部 -->
      <template #header>
        <div class="tableBar">
          <span>欢迎回来！</span>
        </div>
      </template>
      
      <div class="charNum"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import {  } from "@/api/common";


onMounted(() => {});


</script>

<style lang="scss" scoped>
.tableBar {
  color: #909399;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charNum {
  width: 100%;
  height: 400px;
}
</style>
