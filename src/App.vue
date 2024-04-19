<template>
<el-config-provider :locale="locale">
    <!-- 路由展示：一级路由出口 -->
    <router-view />
</el-config-provider>
</template>

<script setup>
// 全局配置国际化：引入element + 中文包
import { ElConfigProvider } from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
const locale = zhCn;
</script>

<style>
* {
  margin: 0;
  padding: 0;
  /* 取消页面鼠标双击选中文字或单击拖动选中文字 */
  user-select: none;
}

/* 解决 el-popover 组件增加滚动条 */
.el_popover_class {
  max-height: 400px !important;
  overflow-y: auto !important;
}
/* 消除el-popover滚动条样式 */
.el_popover_class::-webkit-scrollbar {
    display: none !important;
}
/* 消除el-side滚动条样式 */
.el-aside::-webkit-scrollbar {
    display: none !important;
}
</style>
