<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>方剂分类</span>
        <el-button type="success" @click="dialog = true" :icon="Plus"
          >新增分类</el-button
        >
      </div>
    </template>

    <!-- 搜索、新增行内表单 -->
    <el-form :inline="true" :model="postForm" class="form-inline">
      <el-form-item label="">
        <el-input
          v-model="postForm.preTypeName"
          style="width: 240px"
          placeholder="请输入需要查询的分类名"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="pageQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 药材列表数据 -->
    <el-table :data="tableData" stripe style="width: 100%" max-height="400">
      <el-table-column prop="preTypeName" label="分类名" />
      <el-table-column prop="createdBy" label="创建人" />
      <el-table-column prop="updatedAt" label="最后操作时间" />
      <el-table-column prop="updatedBy" label="操作人" />

      <!-- 自定义：操作 -->
      <el-table-column label="操作" align="right" width="140px" >
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

    <template #footer>
      <!-- 分页器 -->
      <PageQuery
        :total="total"
        :pageNum="postForm.pageNum"
        :pageSize="postForm.pageSize"
        @page-size="handlePageSize"
        @page-num="handlePageNum"
      ></PageQuery>
    </template>
  </el-card>

  <!-- 编辑框 -->
  <el-dialog v-model="dialogVisible" title="分类编辑" width="25%">
    <el-form
      ref="updateFormRef"
      :model="updateForm"
      :rules="rules"
      class="ruleForm"
      label-position="top"
      style="font-weight: bold"
    >
      <el-form-item label="分类ID" prop="preTypeId">
        <el-input v-model="updateForm.preTypeId" disabled />
      </el-form-item>
      <el-form-item label="分类名称" prop="typeName">
        <el-input v-model="updateForm.preTypeName" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm()"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 新增框 -->
  <el-dialog v-model="dialog" title="新增分类" width="25%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="rules"
      class="ruleForm"
      style="font-weight: bold"
    >
      <el-form-item label="分类名称" prop="preTypeName" required>
        <el-input v-model="addForm.preTypeName" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd()"> 新增 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  getpreCategoryListByPageApi,
  postAddPrescriptionCategoryApi,
  putUpdPrescriptionCategoryApi,
  delPrescriptionCategoryApi,
} from "@/api/prescription";
import { ElMessage } from "element-plus";
import PageQuery from "@/components/common/PageQuery.vue";

// 分页查询初始数据
const postForm = reactive({
  preTypeName: "",
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的数据总数
const total = ref(0);
// 存储请求回来的信息数据
const tableData = ref([]);
// 控制对话框是否显示 -- 编辑
const dialogVisible = ref(false);
// 对话框对象--编辑
const updateFormRef = ref();
// 表单项 -- 编辑
const updateForm = reactive({
  preTypeId: null,
  preTypeName: "",
});
// 控制对话框是否显示 -- 新增
const dialog = ref(false);
// 表单对象 -- 新增
const addFormRef = ref();
// 表单项 -- 新增
const addForm = reactive({
  preTypeName: "",
});

onMounted(() => {
  pageQuery();
});

/**
 * 获取药材分类列表
 */
const pageQuery = async () => {
  try {
    const res = await getpreCategoryListByPageApi(postForm);

    tableData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
  }
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  const { preTypeId } = item;

  try {
    const res = await delPrescriptionCategoryApi(preTypeId);

    // 重新取一遍数据，渲染页面
    await pageQuery();
    ElMessage.success(res.msg);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 点击编辑并回显
 */
const handleEdit = (item) => {
  // console.log("🚀 ~ item:", item);

  // 【注意】这里要一一赋值
  updateForm.preTypeId = item.preTypeId;
  updateForm.preTypeName = item.preTypeName;
  // console.log("🚀 ~ handleEdit ~ updateForm:", updateForm);

  dialogVisible.value = true;
};

/**
 * 保存编辑
 */
const handleConfirm = async () => {
  // 发起请求
  try {
    const res = await putUpdPrescriptionCategoryApi(updateForm);
    // console.log("🚀 ~ handleConfirm ~ updateForm:", updateForm);
    ElMessage.success(res.msg);

    // 控制对话框显示
    dialogVisible.value = false;
    await pageQuery();
  } catch (error) {
    // console.log("🚀 ~ handleConfirm ~ error:", error);
  }
};

/**
 * 新增
 */
const handleAdd = async () => {
  // console.log("🚀 ~ handleAdd ~ addForm:", addForm)

  try {
    const res = await postAddPrescriptionCategoryApi(addForm);
    ElMessage.success(res.msg);

    // 重新取一遍数据，渲染页面
    await pageQuery();

    dialog.value = false;
    // console.log("🚀 ~ handleAdd ~ res:", res)
  } catch (error) {
    // console.log("🚀 ~ handleAdd ~ error:", error);
  }
};

/**
 * 分页器--当前页的数据量
 */
const handlePageSize = (pageSizeVal) => {
  // console.log(pageSizeVal);

  postForm.pageSize = pageSizeVal.pageSize;
  pageQuery();
};

/**
 * 分页器--切换页码
 */
const handlePageNum = (pageNumVal) => {
  // console.log(pageNumVal);

  postForm.pageNum = pageNumVal.pageNum;
  pageQuery();
};

// 验证表单规则
const rules = reactive({
  preTypeName: [
    {
      required: true,
      message: "分类名不能为空",
      trigger: "blur",
    },
    { min: 2, max: 6, message: "长度必须在2到6个字符之间", trigger: "blur" },
  ],
});
</script>

<style lang="scss" scoped>
.tableBar {
  color: #909399;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-table .cell) {
  justify-content: center;
}
</style>
