import "@/assets/css/index.scss";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers/index.js";
import { createPinia } from "pinia";
// pinia的持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 粒子库
// import Particles from "particles.vue3";
import Particles from "vue3-particles";
import echarts from "@/utils/echarts"

// 跳转后返回顶部
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})

// 将App create()实例化后挂载到根组件#app上
createApp(App)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(Particles)
  .provide('$echarts', echarts)  // vue3采用provide, inject方式使用
  .mount("#app");