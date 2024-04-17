// 二级路由
import indexView from "@/views/front/index.vue";

const routes = [
  // 首页
  {
    path: "/index",
    name: "index",
    component: indexView,
    meta: { requiresAuth: false },
  },
  // 新闻列表页
  {
    path: "/front/news/list",
    name: "newlist",
    component: () => import("@/views/front/news/newList.vue"),
    meta: { requiresAuth: false },
  },
  // 在线咨询
  {
    path: "/front/service/consult",
    name: "consult",
    component: () => import("@/views/front/service/consult.vue"),
    meta: { requiresAuth: true },
  },
  // 药材展示
  {
    path: "/front/medicine/list",
    name: "medicineList",
    component: () => import("@/views/front/medicine/medicineList.vue"),
    meta: { requiresAuth: false },
  },
  // 方剂展示
  {
    path: "/front/prescription/list",
    name: "preList",
    component: () => import("@/views/front/prescription/preList.vue"),
    meta: { requiresAuth: false },
  },
  {
    path:"/front/user",
    name:"user",
    meta: { requiresAuth: false },
  },
  // 我的——我的信息
  {
    path: "/front/user/mine",
    name: "mine",
    component: () => import("@/views/front/user/mine.vue"),
    meta: { requiresAuth: true },
  },
  // 我的——我的收藏
  {
    path: "/front/user/stars",
    name: "stars",
    component: () => import("@/views/front/user/stars.vue"),
    meta: { requiresAuth: true },
  },
  // 我的——我的方剂上传
  {
    path: "/front/user/prescription/upload",
    name: "upload",
    component: () => import("@/views/front/user/upload.vue"),
    meta: { requiresAuth: true },
  },
  // 我的——我的认证功能
  {
    path: "/front/user/identify",
    name: "identify",
    component: () => import("@/views/front/user/identify.vue"),
    meta: { requiresAuth: true },
  },
];

export default routes;
