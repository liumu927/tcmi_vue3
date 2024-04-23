// 对路由进行相关配置

import { createRouter, createWebHashHistory } from "vue-router";
import MainView from "@/views/front/MainView.vue";
import LayoutView from "@/views/manage/LayoutView.vue";
import frontConfig from "./frontConfig.js";
import manageConfig from "./manageConfig.js";
import { useRouterStore } from "@/stores/useRouterStore.js";
import { useUserStore } from "@/stores/useUserStore.js";

// 路由规则
const routes = [
  // 解决：路由报[Vue Router warn]: No match found for location with path
  {
    path: "/:pathMatch(.*)*",
    meta: {
      title: "找不到此页面",
    },
    component: () => import("@/views/error/404.vue"),
  },
  // 前台容器
  {
    path: "/",
    name: "main",
    redirect: "/index",
    component: MainView,
    // 路由元信息：不需要登陆也可以浏览主页
    meta: { requiresAuth: false },
  },
  // 前台登录页
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/front/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  // 注册页
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/front/RegisterView.vue"),
    meta: { requiresAuth: false },
  },
  // 后台登录页
  {
    path: "/manage/login",
    name: "manageLogin",
    component: () => import("@/views/manage/manageLogin.vue"),
    meta: { requiresAuth: false },
  },
  // 后台容器
  {
    path: "/layout",
    name: "layout",
    redirect: "/manage/home",
    component: LayoutView,
    meta: { requiresAuth: true },
  },
  // 用户编辑页
  {
    path: "/manage/user_manage/user/edit",
    name: "editUser",
    component: () => import("@/views/manage/user-manage/EditUser.vue"),
    meta: { requiresAuth: true },
  },
  // 药材编辑页
  {
    path: "/manage/medicine_manage/message/edit",
    name: "editMedicine",
    component: () => import("@/views/manage/medicine-manage/EditMedicine.vue"),
    meta: { requiresAuth: true },
  },
  // 方剂编辑页
  {
    path: "/manage/prescription_manage/message/edit",
    name: "editPrescription",
    component: () => import("@/views/manage/prescription-manage/EditPrescription.vue"),
    meta: { requiresAuth: true },
  },
  // 资讯编辑页
  {
    path: "/manage/article_manage/articles/edit",
    name: "editArticle",
    component: () => import("@/views/manage/article-manage/EditArticle.vue"),
    meta: { requiresAuth: true },
  },
  // 文章详情页
  {
    path: "/front/news/list/detail",
    name: "articleDetail",
    component: () => import("@/views/front/news/newDetail.vue"),
    meta: { requiresAuth: true },
  },
    // 药材详情页
    {
      path: "/front/medicine/list/detail",
      name: "medicineDetail",
      component: () => import("@/views/front/medicine/medicineDetail.vue"),
      meta: { requiresAuth: true },
    },
      // 方剂详情页
  {
    path: "/front/prescription/list/detail",
    name: "prescriptionDetail",
    component: () => import("@/views/front/prescription/preDetail.vue"),
    meta: { requiresAuth: true },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 配置路由信息
  routes,
});

// 路由拦截：全局路由守卫
router.beforeEach((to, from, next) => {
  const { isGetterRouter } = useRouterStore();
  const { isLogin } = useUserStore();

  // 判断是否需要登陆
  if (to.meta.requiresAuth) {
    // 需要登陆,判断是否已经登录
    if (!isLogin) {
      // 【问题】登录失效后没有明显的提示，直接报401
      // 需要登录但未登录
      next("/login");
    }

    // 已经登录，放行
    next();
  } else {
    // 不需要登录

    // 创建前/后台路由, 若是第一次配置路由，才调用；否则会一直重复渲染路径
    if (!isGetterRouter) {
      addDynamicRoutes();

      // 重定向,为了让刚刚添加的动态路由规则生效
      next({
        path: to.fullPath,
        replace: true,
      });
    } else {
      next();
    }
  }
});

// 统一路由配置
const addDynamicRoutes = () => {
  let { changeRouter } = useRouterStore();
  if (!changeRouter) return;

  frontConfig.forEach((item) => {
    router.addRoute("main", item);
  });

  manageConfig.forEach((item) => {
    router.addRoute("layout", item);
  });

  changeRouter(true);
};

// 导出路由
export default router;
