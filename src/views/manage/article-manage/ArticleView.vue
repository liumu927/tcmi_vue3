<template>
  <el-card>
    <!-- 头部 -->
    <template #header>
      <div class="tableBar">
        <span>资讯管理</span>
        <el-button type="success" @click="handleEdit" :icon="Plus"
          >新增资讯</el-button
        >
      </div>
    </template>

    <!-- 搜索、新增行内表单 -->
    <el-form :inline="true" :model="postForm" class="form-inline">
      <el-form-item label="内容">
        <el-input
          v-model="postForm.content"
          style="width: 150px"
          placeholder="请输入相关内容"
        />
      </el-form-item>
      <el-form-item label="标题">
        <el-input
          v-model="postForm.title"
          style="width: 150px"
          placeholder="请输入资讯标题"
        />
      </el-form-item>
      <el-form-item label="作者">
        <el-input
          v-model="postForm.author"
          style="width: 150px"
          placeholder="请输入作者"
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="postForm.articleCategory"
          style="width: 150px"
          @click="getCategoryList"
          clearable
        >
          <el-option
            v-for="item in categorysList"
            :key="item.articleTypeId"
            :label="item.typeName"
            :value="item.articleTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="pageQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 资讯列表数据 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      show-overflow-tooltip
    >
      <el-table-column label="封面图">
        <template #default="scope">
          <el-avatar :size="40" :src="scope.row.coverImg" @error="errorHandler">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="150px" fixed />
      <el-table-column label="分类" prop="articleTypeName" width="150px">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.articleTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="150px" />
      <el-table-column prop="articleImg" label="文章图片">
        <template #default="scope">
          <el-avatar
            :size="40"
            :src="scope.row.articleImg"
            @error="errorHandler"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" width="150px"  />
      <el-table-column prop="createdAt" label="创建时间" width="150px" />
      <el-table-column prop="updatedBy" label="最后操作时间" width="150px" />

      <!-- 自定义：操作 -->
      <el-table-column label="操作" align="center" width="140px" fixed="right">
        <!-- 操作按钮 -->
        <template #default="scope">
          <el-button size="small" type="warning" @click="handleEdit(scope.row)"
            >编辑</el-button
          >

          <!-- confirm	点击确认按钮时触发 -->
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="handleDelete(scope.row)"
            confirm-button-text="是"
            cancel-button-text="否"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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
import { Plus } from "@element-plus/icons-vue";
import {
  getArticleListApi,
  delArticleApi,
  getArticleCategoryListApi,
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
const tableData = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
// 存放分类列表
const categorysList = ref([]);

onMounted(() => {
  pageQuery();
});

/**
 * 获取资讯列表
 */
const pageQuery = async () => {
  try {
    console.log("🚀 ~ pageQuery ~ postForm:", postForm);
    var res = await getArticleListApi(postForm);

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
    var res = await getArticleCategoryListApi();

    console.log("🚀 ~ getCategoryList ~ res:", res);

    categorysList.value = res.data;

    // console.log("🚀 ~ getCategoryList ~ categorysList:", categorysList);
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 编辑--新增与更新使用同一页面(组件)
 * 根据是否传递参数来判断
 */
const handleEdit = (item) => {
  // console.log("🚀 ~ handleEdit ~ item:", item);

  // 跳转编辑页--携带数据
  router.push({
    name: "editArticle",
    query: { articleId: item.articleId },
  });
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  // console.log("🚀 ~ handleDelete ~ item:", item);

  const { articleId } = item;

  try {
    const res = await delArticleApi(articleId);

    // 重新取一遍数据，渲染页面
    await pageQuery();
    ElMessage.success(res.msg);
  } catch (error) {
    // console.log("🚀 ~ handleDelete ~ error:", error);
  }
};

/**
 * 分页器--当前页的数据量
 */
const handlePageSize = (pageSizeVal) => {
  // // console.log("🚀 ~ handlePageSize ~ pageSizeVal:", pageSizeVal)

  postForm.pageSize = pageSizeVal.pageSize;
  pageQuery();
};

/**
 * 分页器--切换页码
 */
const handlePageNum = (pageNumVal) => {
  // // console.log("🚀 ~ handlePageNum ~ pageNumVal:", pageNumVal)

  postForm.pageNum = pageNumVal.pageNum;
  pageQuery();
};

/**
 * 图片加载失败时的回退行为
 */
const errorHandler = () => true;
</script>

<style lang="scss" scoped>
.tableBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-table .cell) {
  text-align: center;
}
</style>
