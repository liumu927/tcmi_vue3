<template>
  <el-card>
    <template #header>
      <!-- 搜索、新增行内表单 -->
      <el-form :inline="true" :model="postForm" class="form-inline">
        <el-form-item label="药材名">
          <el-input
            v-model="postForm.medicineName"
            style="width: 180px"
            placeholder="请输入药材名"
          />
        </el-form-item>
        <el-form-item label="药材别名">
          <el-input
            v-model="postForm.medicineAlias"
            style="width: 180px"
            placeholder="请输入药材别名"
          />
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
                :key="item.medicineTypeId"
                :class="{ active: selectedTypeId === item.medicineTypeId }"
                @click="getListBySelectType(item.medicineTypeId)"
              >
                {{ item.medicineTypeName }}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="container">
      <!-- 列表 -->
      <div class="prescription">
        <div class="pre-list" v-if="tableData.length">
          <div
            class="pre-item"
            v-for="item in tableData"
            :key="item.medicineId"
            @click="
            router.push({
              name: 'medicineDetail',
              query: { medicineId: item.medicineId }
            })
          "
          >
            <div class="info">
              <p>{{ item.medicineName }}</p>
              <div class="pre-content">
                <el-row>
                  <el-col><em>药用部位：</em>{{ item.medicinalParts }}</el-col>
                </el-row>
                <el-row>
                  <el-col><em>药材性状：</em>{{ item.analysis }}</el-col>
                </el-row>
                <el-row>
                  <el-col><em>功效与作用：</em>{{ item.effects }}</el-col>
                </el-row>
              </div>
            </div>
            <p><img :src="item.medicineImg" /></p>
          </div>
        </div>
        <div v-else><el-empty description="暂时没有数据哦~看看别的吧😆" /></div>
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
import { getMedicineListApi, getMedCategoryListApi } from "@/api/medicine";
import { useRouter, useRoute } from "vue-router";
import PageQuery from "@/components/common/PageQuery.vue";

// 路由
const router = useRouter();
const route = useRoute();
const getTypeByQuery = route.query.selectedType;
const getNameByQuery = route.query.medicineName;
const postForm = reactive({
  medicineName: getNameByQuery,
  medicineAlias: "", // 别名
  medicineTypeId: getTypeByQuery,
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的药材信息数据
const tableData = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
// 存放分类列表
const categorysList = ref([]);
// 当前选中的类型
const selectedTypeId = ref(0);

onMounted(() => {
  getCategoryList();
  toThisPage();
});

/**
 * 路由跳转+默认高亮
 */
const toThisPage = () => {
  // 判断是否从首页带参数来的
  if (!getTypeByQuery) {
    // 不是,则加载时默认将“全部”标签高亮
    getListBySelectType(3999);
  } else {
    // 带了参数，走这里
    pageQuery();
  }
};

/**
 * 根据选中的分类查药材并高亮
 */
const getListBySelectType = (selectId) => {
  if (selectId === 3999) {
    // 如果点击了“全部”，则显示全部列表
    selectedTypeId.value = selectId;
    // 重置选中的分类
    postForm.medicineTypeId = null;
    pageQuery();
  } else {
    selectedTypeId.value = selectId;
    postForm.medicineTypeId = selectId;
    pageQuery();
  }
};

/**
 * 获取药材列表
 */
const pageQuery = async () => {
  try {
    var res = await getMedicineListApi(postForm);

    tableData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 *  获取分类列表
 */
const getCategoryList = async () => {
  try {
    var res = await getMedCategoryListApi();

    categorysList.value = res.data;

    // 追加标签字段
    categorysList.value.unshift({
      medicineTypeId: 3999,
      medicineTypeName: "全部",
    });

    // 判断是否有路由参数，有则高亮对应的标签
    categorysList.value.forEach((element) => {
      // 这里用不能用强类型等于
      if (getTypeByQuery && element.medicineTypeId == getTypeByQuery) {
        selectedTypeId.value = element.medicineTypeId;
      }
    });
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

  // 行内表单 搜索框
  .el-form-item {
    // 清除样式
    margin-bottom: 0;
  }

  .el-row {
    margin-bottom: 10px;
    padding-bottom: 10px;

    .typelist {
      display: flex;
      align-items: center;
      border-bottom: 1px dashed $theme-color;

      // 分类标题
      & span:first-child {
        font-size: 16px;
        font-weight: bold;
        color: $title-color;
        margin-right: 25px;
        margin-bottom: 10px;
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

  // 内容主容器
  .container {
    // 药材容器
    .prescription {
      width: 100%;

      // 药材列表
      .pre-list {
        margin-top: 40px;

        // 单个药材盒子
        .pre-item {
          display: flex;
          justify-content: space-around;
          align-items: center;
          // 设置行与列之间的间隙
          gap: 30px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          cursor: pointer;
          border: 1px;

          p img {
            width: 250px;
            height: 150px;
          }

          .info {
            width: 60%;
            p:first-child {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 15px;
            }
          }
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
