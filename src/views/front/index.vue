<!-- 前台首页 -->

<template>
  <el-card>
    <template #header>
      <!-- 搜索框 -->
      <el-row justify="center" class="select">
        <el-col :span="10">
          <el-input
            v-model="select.selectName"
            style="max-width: 600px"
            placeholder="请先选择搜索模式，再进行搜索哦~"
            class="input-with-select"
          >
            <template #prepend>
              <el-select
                v-model="select.id"
                placeholder="请选择模式"
                style="width: 115px"
              >
                <el-option
                  v-for="item in selectList"
                  :key="item.id"
                  :label="item.mode"
                  :value="item.id"
                />
              </el-select>
            </template>
            <template #append>
              <el-button @click="pageQueryBySelect">搜索</el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </template>

    <!-- 轮播图 -->
    <div id="flash">
      <el-carousel :interval="5000" type="card" height="250px">
        <el-carousel-item v-for="(item, coverId) in coverData" :key="coverId">
          <img :src="item.coverImg" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类 -->
    <div class="categoryContent">
      <!-- 药材分类 -->
      <el-row>
        <el-col :span="24">
          <div class="typelist">
            <p>药材分类</p>
            <ul>
              <li
                v-for="item in medicineTypeList"
                :key="item.medicineTypeId"
                @click="
                  router.push(
                    `/front/medicine/list?selectedType=${item.medicineTypeId}&pageNum=1&pageSize=10`
                  )
                "
              >
                {{ item.medicineTypeName }}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>

      <!-- 方剂分类 -->
      <el-row>
        <el-col :span="24">
          <div class="typelist">
            <p>方剂分类</p>
            <ul>
              <li
                v-for="item in prescriptionTypeList"
                :key="item.preTypeId"
                @click="
                  router.push(
                    `/front/prescription/list?selectedType=${item.preTypeId}&pageNum=1&pageSize=10`
                  )
                "
              >
                {{ item.preTypeName }}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 最新资讯 -->
    <div class="article">
      <p class="title">最新资讯</p>
      <div class="articlelist">
        <div
          class="articleitem"
          v-for="item in articlesList"
          :key="item.articleId"
          @click="handleToArticle(item.articleId)"
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
    </div>

    <!-- 关于我们 + 公告 -->
    <div class="oldContent">
      <!-- 关于我们 -->
      <div class="left">
        <div class="title"><em>百草中医药平台</em></div>
        <div class="contentlist">
          <p>简介</p>
          <ul>
            <li>
              <em>网站：</em>
              www.xxx.com
            </li>

            <li>
              <em>服务地址：</em>
              北京 上海 天津 广东 广州 全国各地
            </li>

            <li>
              <em>适合对象：</em>
              所有用户
            </li>

            <li>
              <em>特色主题：</em>
              公共卫生
            </li>

            <li>
              <em>参与人数：</em>
              3000人
            </li>

            <li>
              <em>工作时间：</em>
              24小时
            </li>
          </ul>
        </div>
        <div class="contentdetail">
          <div>
            <p>网站详情</p>
            <p>
              中医药平台是一个致力于提供全面、准确、及时的公共卫生信息的在线平台。该平台的目标是为广大民众、医务人员和决策者提供高质量的健康资讯，以便有效应对突发疾病、疫情爆发和其他公共卫生事件。该平台汇集了来自全球各地的公共卫生专家和研究机构的知识和经验。用户可以通过平台轻松获取最新的公共卫生新闻、健康建议和预防措施等信息。平台还提供了丰富多样的教育资源和培训课程，帮助用户了解和应对不同疾病和健康问题。
            </p>
          </div>
        </div>

        <div class="taglist">
          <div class="banxue">网站优势</div>
          <div class="tag">快速</div>
          <div class="tag">精准</div>
          <div class="tag">专业</div>
          <div class="tag">和谐</div>
        </div>
      </div>

      <!-- right -->
      <div class="right">
        <div class="rightboxtop">
          <div class="boxtitle">
            <span>最新公告</span>
          </div>

          <ul>
            <li v-for="item in noticesList" :key="item.id">
              <p @click="openclick(item)">
                {{ item.title }}
              </p>
              <span style="width: 100px; font-size: 12px; text-align: center">{{
                item.createdAt
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-card>

  <!-- 公告详情弹出框 -->
  <el-dialog v-model="noticeDialog" title="系统公告" width="40%">
    <h3>{{ noticeDetail.title }}</h3>
    <div>{{ noticeDetail.content }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="noticeDialog = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { getCoverListApi, getNoticeListApi } from "@/api/common.js";
import { getMedCategoryListApi } from "@/api/medicine";
import { getPreCategoryListApi } from "@/api/prescription";
import { getArticleListApi } from "@/api/articles";

const router = useRouter();
const coverData = ref([]);
const medicineTypeList = ref([]);
const prescriptionTypeList = ref([]);
const articlesList = ref([]);
const noticesList = ref([]);
// 弹出框回显
const noticeDetail = ref([]);
// 收集首页搜索框的数据
const select = reactive({
  id: null, // 搜索模式
  selectName: "",
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 可选择的方式
const selectList = reactive([
  { id: 100, mode: "药材名称" },
  { id: 200, mode: "方剂名称" },
]);
// 控制公告的弹出对话框
const noticeDialog = ref(false);

onMounted(() => {
  getCoverList();
  getMedCategoryList();
  getPreCategoryList();
  getArticleByPageQuery();
  getNoticepageQuery();
});

/**
 * 跳转文章详情页
 */
const handleToArticle = (articleId) => {
  console.log("🚀 ~ handleToArticle ~ articleId:", articleId);
  router.push({
    name: "articleDetail",
    query: { articleId: articleId },
  });
};
/**
 * 获取轮播图列表
 */
const getCoverList = async () => {
  try {
    var res = await getCoverListApi();

    coverData.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * 根据选择的方式发送不同的请求
 */
const pageQueryBySelect = async () => {
  // 判断选择的方式

  // 模糊搜药材名称
  if (select.id === 100) {
    // 封装请求体
    const params = {
      pageNum: select.pageNum,
      pageSize: select.pageSize,
      medicineName: select.selectName,
    };

    // 携带数据跳转【药材展示】页
    router.push({
      name: "medicineList",
      query: params,
    });
  } else if (select.id === 200) {
    // 封装请求体
    const params = {
      pageNum: select.pageNum,
      pageSize: select.pageSize,
      prescriptionName: select.selectName,
    };

    // 携带数据跳转【方剂推荐】页
    router.push({
      name: "preList",
      query: params,
    });
  } else {
    ElMessage.warning("请选择搜索模式！");
  }
};

/**
 * 获取药材分类列表
 */
const getMedCategoryList = async () => {
  try {
    var res = await getMedCategoryListApi();
    medicineTypeList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 *  获取方剂分类列表
 */
const getPreCategoryList = async () => {
  try {
    var res = await getPreCategoryListApi();
    prescriptionTypeList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 获取资讯列表
 */
const getArticleByPageQuery = async () => {
  try {
    // 封装请求体
    const params = {
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页的记录数
    };

    var res = await getArticleListApi(params);
    articlesList.value = res.data.items;
  } catch (error) {
    console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 * 获取公告列表
 */
const getNoticepageQuery = async () => {
  try {
    const params = {
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页的记录数
    };

    var res = await getNoticeListApi(params);
    noticesList.value = res.data.items;
  } catch (error) {
    console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 * 查看公告详情
 */
const openclick = (data) => {
  // 回显
  noticeDetail.value = data;
  noticeDialog.value = true;
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.el-card {
  padding: 0 20px;

  .el-row {
    margin-bottom: 10px;
  }

  // 搜索框
  .select {
    margin-bottom: 0px;

    .el-input-group {
      div {
      }
      button {
      }
    }
  }

  // 轮播图容器
  #flash {
    width: 80%;
    height: 250px;
    margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }
  }

  // 整个分类容器
  .categoryContent {
    margin: 80px 0;

    // 单个分类盒子
    .el-col {
      border-bottom: 1px dashed $theme-color;
      padding-bottom: 10px;

      // 分类标题
      & p:first-child {
        font-size: 16px;
        font-weight: bold;
        color: $theme-color;
      }

      // 分类列表
      & ul {
        display: block;
        list-style: none;
        margin: 10px;

        li {
          float: left;
          border: 1px solid rgb(65, 199, 128);
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

  // 资讯容器
  .article {
    // 标题
    .title {
      font-size: 16px;
      font-weight: bold;
      color: $theme-color;
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

  // 关于我们+公告 容器
  .oldContent {
    display: flex;

    .left {
      width: 70%;

      // 标题
      .title {
        font-size: 20px;
        margin-bottom: 15px;
      }

      // 简介
      .contentlist {
        p {
          font-size: 18px;
          color: $title-color;
          font-weight: 700;
          margin-left: 10px;
        }

        ul {
          list-style: none;
          width: 80%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin: 5px 0 15px 10px;

          li {
            width: 352px;
            height: 15px;
            margin: 5px 0;
            font-size: 14px;
          }
        }
      }

      // 网站详情
      .contentdetail {
        margin-left: 10px;

        p:first-child {
          font-size: 18px;
          color: $title-color;
          font-weight: 700;
        }

        p:last-child {
          width: 80%;
          margin-top: 5px;
          line-height: 1.8;
          margin-bottom: 15px;
          // 首行缩进
          text-indent: 4%;
        }
      }

      // 网站优势
      .taglist {
        margin-top: 20px;
        width: 100%;
        height: 38px;

        .banxue {
          font-size: 18px;
          color: $title-color;
          font-weight: 700;
          margin-left: 10px;
        }
        .tag {
          width: 142px;
          height: 33px;
          text-align: center;
          line-height: 33px;
          color: #fff;
          background-color: #7c8cbf;
          border-radius: 0.2rem;
          margin: 10px;
          float: left;

          &:nth-child(2) {
            background-color: #77a3d4;
          }
          &:nth-child(3) {
            background-color: #7ab7c9;
          }
          &:nth-child(4) {
            background-color: #73b0dc;
          }
        }
      }
    }

    // 右侧公告盒子
    .right {
      width: 30%;

      .rightboxtop {
        width: 100%;

        // 公告标题
        .boxtitle {
          width: 50%;
          height: 46px;
          line-height: 46px;
          font-size: 18px;
          font-weight: 550;
          margin-bottom: 10px;
          border-bottom: 2px solid $title-color;
        }

        // 公告列表
        ul {
          list-style: none;

          li {
            width: 90%;
            height: 32px;
            display: flex;
            margin: 8px 0;
            cursor: pointer;
            border-bottom: 1px solid #fff;

            p {
              width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              font-size: 15px;
              color: #333;
            }
          }

          li:hover {
            color: $title-color;
            border-bottom: 1px double $title-color;
          }
          li:hover p {
            color: $title-color;
          }
        }
      }
    }
  }
}
</style>
