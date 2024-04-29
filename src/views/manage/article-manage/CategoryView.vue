<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>资讯分类</span>
        <el-button type="success" @click="dialog = true" :icon="Plus"
          >新增分类</el-button
        >
      </div>
    </template>

    <!-- 搜索、新增行内表单 -->
    <!-- <el-form :inline="true" :model="typeName" class="form-inline">
      <el-form-item label="">
        <el-input
          v-model="typeName"
          style="width: 240px"
          placeholder="请输入需要查询的分类名"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="selectByname">搜索</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 分类列表数据 -->
    <el-table :data="tableData" stripe style="width: 100%" max-height="420">
      <el-table-column prop="typeName" label="分类名" />
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
      <el-form-item label="分类ID" prop="articleTypeId">
        <el-input v-model="updateForm.articleTypeId" disabled />
      </el-form-item>
      <el-form-item label="分类名称" prop="typeName">
        <el-input v-model="updateForm.typeName" />
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
      <el-form-item label="分类名称" prop="typeName" required>
        <el-input v-model="addForm.typeName" />
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
  getArticleCategoryApi,
  postAddArticleCategoryApi,
  putUpdArticleCategoryApi,
  delArticleCategoryApi,
} from "@/api/articles";
import { ElMessage } from "element-plus";

// 存储请求回来的信息数据
const tableData = ref([]);
// 搜索
const typeName = ref("");
// 控制对话框是否显示 -- 编辑
const dialogVisible = ref(false);
// 对话框对象--编辑
const updateFormRef = ref();
// 表单项 -- 编辑 【注意】这里如果使用ref，则会导致列表会跟着编辑框内容变化
const updateForm = reactive({
  articleTypeId: null,
  typeName: "",
});
// 控制对话框是否显示 -- 新增
const dialog = ref(false);
// 表单对象 -- 新增
const addFormRef = ref();
// 表单项 -- 新增
const addForm = reactive({
  typeName: "",
});

onMounted(() => {
  getList();
});

/**
 * 获取资讯分类列表
 */
const getList = async () => {
  try {
    const res = await getArticleCategoryApi();

    tableData.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  const { articleTypeId } = item;

  try {
    const res = await delArticleCategoryApi(articleTypeId);

    // 重新取一遍数据，渲染页面
    await getList();
    ElMessage.success(res.msg);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 点击编辑并回显
 */
const handleEdit = (item) => {
  console.log("🚀 ~ item:", item);

  // 【注意】这里要一一赋值
  updateForm.articleTypeId = item.articleTypeId;
  updateForm.typeName = item.typeName;
  console.log("🚀 ~ handleEdit ~ updateForm:", updateForm);

  dialogVisible.value = true;
};

/**
 * 保存编辑
 */
const handleConfirm = async () => {
  // 发起请求
  try {
    const res = await putUpdArticleCategoryApi(updateForm);
    console.log("🚀 ~ handleConfirm ~ updateForm:", updateForm);
    ElMessage.success(res.msg);

    // 控制对话框显示
    dialogVisible.value = false;
    await getList();
  } catch (error) {
    console.log("🚀 ~ handleConfirm ~ error:", error);
  }
};

/**
 * 新增
 */
const handleAdd = async () => {
  // console.log("🚀 ~ handleAdd ~ addForm:", addForm)

  try {
    const res = await postAddArticleCategoryApi(addForm);
    ElMessage.success(res.msg);

    // 重新取一遍数据，渲染页面
    await getList();

    dialog.value = false;
    // console.log("🚀 ~ handleAdd ~ res:", res)
  } catch (error) {
    console.log("🚀 ~ handleAdd ~ error:", error);
  }
};

/**
 * 根据名称查询
 */
const selectByname = () => {
  // typeName
};

// 验证表单规则
const rules = reactive({
  typeName: [
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
  text-align: center;
}
</style>
