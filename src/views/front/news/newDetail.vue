<template>
  <NavMenu></NavMenu>
  <el-card>
    <template #header>
      <div class="card-header">
        <h1>{{ articleDetail.title }}</h1>
        <p style="color: grey; font-size: 12px">
          更新时间：{{ articleDetail.updatedAt }}
        </p>
      </div>
    </template>

    <div class="main">
      <div class="tag">
        <p>
          分类专栏：<el-tag type="info">{{
            articleDetail.articleTypeName
          }}</el-tag>
        </p>
        <p>
          文章作者：<span>{{ articleDetail.author }}</span>
        </p>
        <p>
          阅读量：<el-tag type="success">{{ articleDetail.viewCount }}</el-tag>
        </p>
      </div>
      <div class="container">
        <!-- 封面图 -->
        <p>
          <img :src="articleDetail.coverImg" />
        </p>
        <div class="text">
          {{ articleDetail.content }}
        </div>
        <!-- 文章图 -->
        <p>
          <img :src="articleDetail.articleImg" />
        </p>
      </div>
    </div>

    <template #footer>
      <div class="left-toolbox">
        <div class="toolbox-left">
          <el-avatar :size="50" :src="articleDetail.coverImg" />
          <span>{{ articleDetail.author }}</span>
        </div>
        <div class="toolbox-right">
          <p>发布时间：{{ articleDetail.createdAt }}</p>
        </div>
      </div>
    </template>
  </el-card>

  <el-card class="comments">
    <template #header>
      <div class="comments-header">
        <h3>留言区</h3>
      </div>
    </template>
    <div class="left-toolbox">
      <div class="toolbox-left">
        <el-avatar :size="50" :src="articleDetail.coverImg" />
        <span>{{ articleDetail.author }}</span>
      </div>
      <div class="toolbox-middle"></div>
      <div class="toolbox-right">
        <p>发布时间：{{ articleDetail.createdAt }}</p>
      </div>
    </div>
  </el-card>

  <Footer></Footer>
</template>

<script setup>
import { useRoute } from "vue-router";
import { reactive, ref, onMounted, computed } from "vue";
import { getArticleDetailApi } from "@/api/articles";

const route = useRoute();
// 接收通过路由跳转传过来的资讯ID
const getArticleId = route.query.articleId;
const articleDetail = ref({});

onMounted(() => {
  getArticleInfo();
});

/**
 * 切割文章内容
 */
const splitText = computed(() => {
  return articleDetail.value.content.split(" ");
});

/**
 * 获取资讯详细信息
 */
const getArticleInfo = async () => {
  try {
    const res = await getArticleDetailApi(getArticleId);
    // 回显
    articleDetail.value = res.data;
  } catch (error) {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-card {
  width: 80%;
  margin: 20px auto;

  // 头部
  .card-header {
    text-align: center;
    overflow: hidden;
    h1 {
      margin-bottom: 10px;
    }
  }

  // 中间全部内容
  .main {
    // tag标签区域
    .tag {
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      margin-bottom: 30px;
    }

    // 内容区域
    .container {
      padding: 0 30px;
      font-size: 16px;

      // 图片
      p {
        height: 200px;
        margin: 20px;
        overflow: hidden;
        display: flex;
        justify-content: center;

        img {
          border-radius: 10px;
        }
      }

      // 每段内容
      div {
        text-indent: 5%;
      }
    }
  }

  // 底部区域
  .left-toolbox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    // 左侧 头像 姓名
    .toolbox-left {
      display: flex;
      align-items: center;

      span:last-child {
        font-size: 18px;
        font-weight: bold;
        display: block;
        margin-left: 20px;
      }
    }
  }
}

.comments {
  margin-top: 30px;
  margin-bottom: 100px;
}
</style>
