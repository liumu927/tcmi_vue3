<template>
  <!-- 路由展示：一级路由出口 -->
  <router-view />
</template>

<script setup></script>

<style>
* {
  margin: 0;
  padding: 0;
  /* 取消页面鼠标双击选中文字或单击拖动选中文字 */
  user-select: none;
}

/* 解决 el popover 组件增加滚动条 */
.el_popover_class {
  max-height: 500px !important;
  overflow-y: auto !important;
}
/* 消除滚动条样式 */
.el_popover_class::-webkit-scrollbar {
    display: none !important;
}
</style>
