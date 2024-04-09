import HomeView from "@/views/manage/home-manage/HomeView.vue";
// 管理员管理
import AdminView from "@/views/manage/admin-manage/AdminView.vue";
// 用户管理
import UserView from "@/views/manage/user-manage/UserView.vue";
// 权限管理-角色列表
import RoleView from "@/views/manage/right-manage/RoleView.vue";
// 权限管理-权限列表
import RightView from "@/views/manage/right-manage/RightView.vue";
// 药材管理-类别
import CategoryView from "@/views/manage/medicine-manage/CategoryView.vue";
// 药材管理-信息
import MessageView from "@/views/manage/medicine-manage/MessageView.vue";
// 方剂管理-分类
import PreCategoryView from "@/views/manage/prescription-manage/PreCategoryView.vue";
// 方剂管理-信息
import PreMessageView from "@/views/manage/prescription-manage/PreMessageView.vue";
// 系统管理-轮播图
import CarouselView from "@/views/manage/system-manage/CarouselView.vue";
// 系统管理-新闻资讯
import NewsView from "@/views/manage/system-manage/NewsView.vue";
// 系统管理-在线咨询
import ServiceView from "@/views/manage/system-manage/ServiceView.vue";
// 数据管理
import ChartView from "@/views/manage/data-manage/ChartView.vue";

// 二级路由
const routes = [
  {
    path: "/manage/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/manage/admin_manage/admin",
    name: "admin",
    component: AdminView,
  },
  {
    path: "/manage/user_manage/user",
    name: "user",
    component: UserView,
  },
  {
    path: "/manage/right_manage/role",
    name: "role",
    component: RoleView,
  },
  {
    path: "/manage/right_manage/right/",
    name: "right",
    component: RightView,
  },
  {
    path: "/manage/medicine_manage/category",
    name: "category",
    component: CategoryView,
  },
  {
    path: "/manage/medicine_manage/message",
    name: "message",
    component: MessageView,
  },
  {
    path: "/manage/prescription_manage/category",
    name: "pre_category",
    component: PreCategoryView,
  },
  {
    path: "/manage/prescription_manage/message",
    name: "pre_message",
    component: PreMessageView,
  },
  {
    path: "/manage/system_manage/carousel",
    name: "carousel",
    component: CarouselView,
  },
  {
    path: "/manage/system_manage/news",
    name: "news",
    component: NewsView,
  },
  {
    path: "/manage/system_manage/service",
    name: "service",
    component: ServiceView,
  },
  {
    path: "/manage/data_manage/chart",
    name: "chart",
    component: ChartView,
  },
];

export default routes;
