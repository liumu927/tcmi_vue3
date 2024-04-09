// 对路由进行相关配置
import { createRouter, createWebHashHistory } from "vue-router";
// 前台容器
import MainView from "@/views/front/MainView.vue";
// 后台容器
import LayoutView from "@/views/manage/LayoutView.vue";
// 前台路由配置
import frontConfig from "./frontConfig.js";
// 后台路由配置
import manageConfig from "./manageConfig.js";
// 两个pinia库
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
    name: "manage_login",
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
];

// 创建路由实例
const router = createRouter({
  // !配置路由模式 #/
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 配置路由信息
  routes,
});

// 路由拦截：全局路由守卫
router.beforeEach((to, from, next) => {
  // isGetterRouter用于存储是否是第一次路由拦截，默认为false
  const { isGetterRouter } = useRouterStore();
  const { isLogin } = useUserStore();

  // 前台路由
  // 判断是否需要登陆
  if (to.meta.requiresAuth) {
    // 需要登陆则判断是否已经登录，未登录就是游客
    if (!isLogin) {
      // 需要登录但未登录
      next("/login");
    }
    // 已经登录，放行
    next();
  } else {
    // 不需要登录
    // 创建前/后台路由, 若是第一次配置路由，才调用
    if (!isGetterRouter) {
      // 为了彻底删除掉已登录用户信息，移除
      // router.removeRoute("main");
      ConfigRouter();

      // router.removeRoute("layout");
      manageConfigRouter();

      // 重定向,为了让刚刚添加的动态路由规则生效
      next({
        path: to.fullPath,
        // replace属性 表示是否使用替换模式进行路由跳转，浏览器的历史记录不会留下当前页面的记录，而是直接跳转到目标页面。
        replace: true,
      });
      return;
    } else {
      next();
    }
  }
});

// 前台：动态添加路由
const ConfigRouter = () => {
  let { changeRouter } = useRouterStore();

  // 遍历数组，添加子集路由
  frontConfig.forEach((item) => {
    // checkPermission(item.path) && router.addRoute("main", item);
    router.addRoute("main", item);
  });

  // console.log(router.getRoutes());

  // 调用changeRouter方法改变状态
  changeRouter(true);
};

// 后台：动态添加路由
const manageConfigRouter = () => {
  // let { changeRouter } = useRouterStore();

  // 遍历数组，添加子集路由
  manageConfig.forEach((item) => {
    // 检查权限：需要根据“谁登录了所获得的哪些权限”来渲染
    // checkPermission(item.path) && router.addRoute("layout", item);
    router.addRoute("layout", item);
  });

  // console.log(router.getRoutes());

  // changeRouter(true);
};

// 检查权限：限制是否可以直接通过访问某路由，但是加上后会出现路由跳转失败问题
const checkPermission = (path) => {
  const { user } = useUserStore();
  // includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。
  return user.role.rights.includes(path);
};

// 导出路由
export default router;
