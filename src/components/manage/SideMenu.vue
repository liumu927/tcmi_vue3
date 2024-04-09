<template>
  <el-aside width="200px">
    <el-scrollbar>
      <div class="logo">百 &nbsp;&nbsp; 草</div>
      <el-menu
        :default-active="route.fullPath"
        class="el-menu-vertical-demo"
        style="height: 100vh"
        :unique-opened="true"
        background-color="#dff7dc"
        active-text-color=" #32CD32"
        text-color="#668B8B"
        :router="true"
      >
        <template v-for="data in datalist" :key="data.path">
          <!-- 含二级菜单 -->
          <!-- 一级菜单 -->
          <el-sub-menu
            :index="data.path"
            v-if="data.children.length && checkAuth(data.path)"
          >
            <template #title>
              <el-icon>
                <component :is="mapIcon[data.icon]"></component>
              </el-icon>
              <span>{{ data.title }}</span>
            </template>
            <!-- 二级菜单 -->
            <template v-for="item in data.children" :key="item.path">
              <el-menu-item :index="item.path" v-if="checkAuth(item.path)">
                <el-icon>
                  <component :is="mapIcon[item.icon]"></component>
                </el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <!-- 一级菜单 -->
          <el-menu-item :index="data.path" v-else-if="checkAuth(data.path)">
            <el-icon>
              <component :is="mapIcon[data.icon]"></component>
            </el-icon>
            <span>{{ data.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { onMounted, ref } from "vue";
// import axios from "axios";
import {
  HomeFilled,
  Avatar,
  UserFilled,
  User,
  Platform,
  Lock,
  HelpFilled,
  Filter,
  List,
  Connection,
  Operation,
  DataAnalysis,
  Aim,
  Service,
  PieChart,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import {
  getManageRightsApi
} from "@/api/api";

// 当前路由对象
const route = useRoute();
// console.log("route:", route);
// 存储请求回来的数据
const datalist = ref([]);
const { userInfo } = useUserStore();

onMounted(() => {
  getManageRights();
});

// 获取侧边栏列表数据
const getManageRights = async () => {
  try {
    var res = await getManageRightsApi("manage");
    datalist.value = res.data;
    // console.log(res)
  } catch (error) {
    console.log(error);
  }
};

// 映射图标
const mapIcon = {
  HomeFilled,
  Avatar,
  UserFilled,
  Platform,
  User,
  Lock,
  HelpFilled,
  Filter,
  List,
  Connection,
  Operation,
  DataAnalysis,
  Aim,
  Service,
  PieChart,
};

// 根据身份对应权限渲染列表
const checkAuth = (path) => {
  return userInfo.role.rights.includes(path);
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.logo {
  width: 200px;
  height: 60px;
  background-color: $second-color;
  color: $theme-color;
  font-size: 32px;
  font-weight: bold;
  font-family: "楷体";
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 999;
}
</style>
