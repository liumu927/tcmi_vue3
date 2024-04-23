<template>
  <el-card>
    <template #header>
      <!-- 搜索、新增行内表单 -->
      <el-form :inline="true" :model="postForm" class="form-inline">
        <el-form-item label="内容">
          <el-input v-model="postForm.content" placeholder="请输入相关内容" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="postForm.title" placeholder="请输入资讯标题" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="postForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="pageQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 分类展示+搜索 -->
    <div class="categoryContent">
      <!-- 分类 -->
      <el-row>
        <el-col :span="24">
          <div class="typelist">
            <span>分类</span>
            <ul>
              <li
                v-for="item in categorysList"
                :key="item.articleTypeId"
                @click="getListBySelectType(item.articleTypeId)"
                :class="{ active: selectedType === item.articleTypeId }"
              >
                {{ item.typeName }}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="container">
      <!-- 科普资讯列表 -->
      <div class="article">
        <p class="title">资讯文章</p>
        <div class="articlelist" v-if="articleListData.length">
          <div
            class="articleitem"
            v-for="item in articleListData"
            :key="item.articleId"
            @click="
              router.push({
                name: 'articleDetail',
                query: { articleId: item.articleId },
              })
            "
          >
            <p><img :src="item.coverImg" /></p>
            <div class="info">
              <p>{{ item.title }}</p>
              <div class="articlecontent">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
        <div v-else><el-empty description="暂时没有数据哦~看看别的吧😆" /></div>
      </div>

      <!-- 热门文章 -->
      <div class="latest">
        <div class="title">热门资讯</div>
        <div class="article-hot">
          <div
            class="hotitem"
            v-for="(item, index) in hotList"
            :key="item.articleId"
            @click="
              router.push({
                name: 'articleDetail',
                query: { articleId: item.articleId },
              })
            "
            v-show="index < 8"
          >
            <p><img :src="item.articleImg" /></p>
            <div>
              <div class="hot-title">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <template #footer>
      <!-- 分页器 -->
      <PageQuery
        :total="total"
        :pageNum="postForm.pageNum"
        :pageSize="postForm.pageSize"
        @page-size="handlePageSize"
        @page-num="handlePageNum"
      ></PageQuery
    ></template>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  getArticleListApi,
  getArticleCategoryApi,
  getArticleHotTenApi,
} from "@/api/articles";
import { useRouter } from "vue-router";
import PageQuery from "@/components/common/PageQuery.vue";

// 路由
const router = useRouter();
// 初始数据
const postForm = reactive({
  title: "",
  articleCategory: null,
  content: "", // 内容
  author: "", // 作者
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的资讯信息数据
const articleListData = ref([]);
// 存储请求回来的热门资讯
const hotList = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
// 存放分类列表
const categorysList = ref([]);
// 当前选中的类型
const selectedType = ref(0);

onMounted(() => {
  pageQuery();
  getCategoryList();
  getHotList();
  // 页面加载时默认将“全部”标签高亮
  getListBySelectType(3999);
});

/**
 * 根据选中的分类查资讯
 */
const getListBySelectType = (selectId) => {
  if (selectId === 3999) {
    // 如果点击了“全部”，则显示全部列表
    selectedType.value = selectId;
    // 重置选中的分类
    postForm.articleCategory = null;
  } else {
    // 否则，按照分类跳转
    selectedType.value = selectId;
    postForm.articleCategory = selectId;
  }
  pageQuery();
};

/**
 * 获取热门资讯
 */
const getHotList = async () => {
  try {
    const res = await getArticleHotTenApi();

    hotList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getHotList ~ error:", error);
  }
};

/**
 * 获取资讯列表
 *
 */
const pageQuery = async () => {
  try {
    var res = await getArticleListApi(postForm);

    // 用于列表展示
    articleListData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 * 获取分类列表
 */
const getCategoryList = async () => {
  try {
    var res = await getArticleCategoryApi();

    categorysList.value = res.data;
    // 追加标签字段
    categorysList.value.unshift({ articleTypeId: 3999, typeName: "全部" });
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 分页器--当前页的数据量
 */
const handlePageSize = (pageSizeVal) => {
  // console.log("🚀 ~ handlePageSize ~ pageSizeVal:", pageSizeVal)

  postForm.pageSize = pageSizeVal.pageSize;
  pageQuery();
};

/**
 * 分页器--切换页码
 */
const handlePageNum = (pageNumVal) => {
  // console.log("🚀 ~ handlePageNum ~ pageNumVal:", pageNumVal)

  postForm.pageNum = pageNumVal.pageNum;
  pageQuery();
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-card {
  padding: 0 20px;

  .el-row {
    margin-bottom: 10px;
    border-bottom: 1px dashed $theme-color;
    padding-bottom: 10px;

    .typelist {
      display: flex;
      align-items: center;
      // 分类标题
      & span:first-child {
        font-size: 16px;
        font-weight: bold;
        color: $title-color;
        margin-right: 25px;
      }

      // 分类列表
      & ul {
        display: block;
        list-style: none;
        margin: 10px 0;
        height: auto;

        li {
          float: left;
          border-radius: 10px;
          background-color: $second-color;
          margin-right: 25px;
          margin-bottom: 10px;
          padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
  }

  .el-form {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  // 内容主容器
  .container {
    display: flex;
    justify-content: space-between;

    // 资讯容器
    .article {
      width: 70%;
      padding-right: 10px;
      border-right: 1px dashed $theme-color;

      // 标题
      .title {
        font-size: 18px;
        font-weight: bold;
        padding: 20px 0;
        border-bottom: 3px dashed $theme-color;
      }

      // 文章列表
      .articlelist {
        margin-top: 40px;

        // 单个文章盒子
        .articleitem {
          display: flex;
          align-items: center;
          // 设置行与列之间的间隙
          gap: 30px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #cecece;
          cursor: pointer;
          border: 1px;

          p img {
            width: 200px;
            height: 120px;
          }

          .info {
            p:first-child {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 15px;
            }

            .articlecontent {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }

    // 热门资讯容器
    .latest {
      width: 25%;
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 8px 12px;
      height: 600px;

      .title {
        font-weight: 700;
        font-size: 18px;
        padding: 16px;
        border-bottom: 3px dashed $title-color;
      }

      // 显示热门个体
      .article-hot {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .hotitem {
          width: 46%;
          margin-bottom: 10px;
        }

        img {
          width: 100%;
          height: 90px;
        }

        .hot-title {
          font-size: 14px;
          margin-top: 10px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $title-color;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .hot-content {
          font-size: 13px;
          margin-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}

// 点击高亮样式
.active {
  font-weight: bold;
  color: $theme-font-color;
  background-color: $theme-color !important;
}
</style>
