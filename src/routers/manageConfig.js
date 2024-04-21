import HomeView from "@/views/manage/home-manage/HomeView.vue";

// 二级路由
const routes = [
  {
    path: "/manage/home",
    name: "home",
    component: HomeView,
  },
  // 管理员管理
  {
    path: "/manage/admin_manage/admin",
    name: "admin",
    component: () => import("@/views/manage/admin-manage/AdminView.vue"),
  },
  // 用户管理-用户列表
  {
    path: "/manage/user_manage/user",
    name: "user",
    component: () => import("@/views/manage/user-manage/UserView.vue"),
  },
  {
    // 用户管理-审核列表
    path: "/manage/user_manage/audit",
    name: "audit",
    component: () => import("@/views/manage/user-manage/AuditView.vue"),
  },
  {
    // 权限管理-角色列表
    path: "/manage/right_manage/role",
    name: "role",
    component: () => import("@/views/manage/right-manage/RoleView.vue"),
  },
  {
    // 权限管理-权限列表
    path: "/manage/right_manage/right",
    name: "right",
    component: () => import("@/views/manage/right-manage/RightView.vue"),
  },
  {
    // 药材管理-类别
    path: "/manage/medicine_manage/category",
    name: "category",
    component: () => import("@/views/manage/medicine-manage/CategoryView.vue"),
  },
  {
    // 药材管理-列表
    path: "/manage/medicine_manage/message",
    name: "med_message",
    component: () => import("@/views/manage/medicine-manage/MessageView.vue"),
  },
  {
    // 方剂管理-分类
    path: "/manage/prescription_manage/category",
    name: "pre_category",
    component: () =>
      import("@/views/manage/prescription-manage/PreCategoryView.vue"),
  },
  {
    // 方剂管理-列表
    path: "/manage/prescription_manage/message",
    name: "pre_message",
    component: () =>
      import("@/views/manage/prescription-manage/PreMessageView.vue"),
  },
  {
    // 资讯管理-分类
    path: "/manage/article_manage/category",
    name: "article_category",
    component: () => import("@/views/manage/article-manage/CategoryView.vue"),
  },
  {
    // 资讯管理-列表
    path: "/manage/article_manage/articles",
    name: "article_message",
    component: () => import("@/views/manage/article-manage/ArticleView.vue"),
  },
  {
    // 系统管理-轮播图
    path: "/manage/system_manage/carousel",
    name: "carousel",
    component: () => import("@/views/manage/system-manage/CarouselView.vue"),
  },
  {
    // 系统管理-公告
    path: "/manage/system_manage/notices",
    name: "notices",
    component: () => import("@/views/manage/system-manage/NoticesView.vue"),
  },
  {
    // 系统管理-在线咨询
    path: "/manage/system_manage/online_chat",
    name: "online_chat",
    component: () => import("@/views/manage/system-manage/OnlineChat.vue"),
  },
  {
    // 数据管理
    path: "/manage/data_manage/chart",
    name: "chart",
    component: () => import("@/views/manage/data-manage/ChartView.vue"),
  },
];

export default routes;
