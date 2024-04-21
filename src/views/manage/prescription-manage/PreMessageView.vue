<template>
  <el-card>
    <!-- 头部 -->
    <template #header>
      <div class="tableBar">
        <span>方剂管理</span>
        <el-button type="success" @click="handleEdit" :icon="Plus"
          >新增方剂</el-button
        >
      </div>
    </template>

    <!-- 搜索、新增行内表单 -->
    <el-form :inline="true" :model="postForm" class="form-inline">
      <el-form-item label="名称">
        <el-input
          v-model="postForm.prescriptionName"
          style="width: 150px"
          placeholder="请输入方剂名"
        />
      </el-form-item>
      <el-form-item label="归经">
        <el-input
          v-model="postForm.origin"
          style="width: 150px"
          placeholder="请输入所在归经"
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="postForm.preTypeId"
          style="width: 150px"
          @click="getCategoryList"
          clearable
        >
          <el-option
            v-for="item in categorysList"
            :key="item.preTypeId"
            :label="item.preTypeName"
            :value="item.preTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="postForm.status" style="width: 150px" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.status"
            :label="item.statusTag"
            :value="item.status"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="pageQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 方剂列表数据 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      show-overflow-tooltip
    >
      <el-table-column
        prop="prescriptionName"
        label="方剂名"
        width="150px"
        fixed
      />
      <el-table-column label="图示">
        <template #default="scope">
          <el-avatar :size="40" :src="scope.row.imgUrl" @error="errorHandler">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150px">
        <template #default="scope">
          <el-tag :type="isType(scope.row.status)">
            {{ getStateMap(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="preTypeName" width="150px">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.preTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="origin" label="方剂归经" width="150px" />
      <el-table-column prop="effects" label="功效" width="150px" />
      <el-table-column prop="composition" label="组成成分" width="150px" />
      <el-table-column prop="prescriptionUsage" label="用法" width="150px" />
      <el-table-column prop="application" label="临床应用" width="150px" />
      <el-table-column prop="applicableCrowd" label="适用人群" width="150px" />
      <el-table-column
        prop="commonPrescriptions"
        label="常用配方推荐"
        width="150px"
      />
      <el-table-column prop="contraindications" label="禁忌症" width="150px" />
      <el-table-column prop="medicinesIds" label="药材组成ID" width="150px" />

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
  getPrescriptionListApi,
  delPrescriptionApi,
  getPreCategoryListApi,
} from "@/api/prescription";
import { useRouter } from "vue-router";
import PageQuery from "@/components/common/PageQuery.vue";

// 路由
const router = useRouter();
// 初始数据
const postForm = reactive({
  prescriptionName: "",
  preTypeId: null,
  origin: "", // 归经
  status: "", // 方剂状态
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的方剂信息数据
const tableData = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
// 存放分类列表
const categorysList = ref([]);
// 存放审核状态列表
const statusList = reactive([
  { status: 0, statusTag: "正常" },
  { status: 1, statusTag: "审核中" },
  { status: 2, statusTag: "审核通过" },
  { status: 3, statusTag: "被驳回" },
]);

onMounted(() => {
  pageQuery();
});

/**
 * 根据审核状态添加不同的类名
 * @param {*} status
 */
const isType = (status) => {
  switch (status) {
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "danger";
    default:
      return "primary";
  }
};

/**
 * 获取审核状态的映射
 * @param {*} row
 * @param {*} col
 */
const getStateMap = (status) => {
  switch (status) {
    case 1:
      return "待审核";
    case 2:
      return "审核通过";
    case 3:
      return "被驳回";
    default:
      return "正常";
  }
};

/**
 * 获取方剂列表
 */
const pageQuery = async () => {
  try {
    // console.log("🚀 ~ pageQuery ~ postForm:", postForm);
    var res = await getPrescriptionListApi(postForm);

    tableData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    // console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 *  获取分类列表
 */
const getCategoryList = async () => {
  try {
    var res = await getPreCategoryListApi();

    // console.log("🚀 ~ getCategoryList ~ res:", res);

    categorysList.value = res.data;

    // console.log("🚀 ~ getCategoryList ~ categorysList:", categorysList);
  } catch (error) {
    // console.log("🚀 ~ getCategoryList ~ error:", error);
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
    name: "editPrescription",
    query: { prescriptionId: item.prescriptionId },
  });
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  // console.log("🚀 ~ handleDelete ~ item:", item);

  const { prescriptionId } = item;

  try {
    const res = await delPrescriptionApi(prescriptionId);

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
