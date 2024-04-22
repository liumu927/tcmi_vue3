Cover
<template>
  <el-card>
    <!-- 头部 -->
    <template #header>
      <div class="tableBar">
        <span>公告管理</span>
        <el-button type="success" @click="dialog = true" :icon="Plus"
          >新增公告</el-button
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
          placeholder="请输入公告标题"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="pageQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 公告列表数据 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="250px"
        fixed
        show-overflow-tooltip
      />
      <el-table-column
        prop="content"
        label="内容"
        width="250px"
        show-overflow-tooltip
      />
      <el-table-column prop="createdAt" label="创建时间" width="140px" />
      <el-table-column prop="updatedAt" label="最后操作时间" width="140px" />
      <el-table-column prop="updatedBy" label="操作人" width="150px" />

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

  <!-- 新增抽屉 -->
  <el-drawer
    ref="drawerRef"
    v-model="dialog"
    title="新增公告"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form ref="addFormRef" :model="addForm" label-width="65px">
        <el-form-item label="标题" prop="title" required>
          <el-input
            v-model="addForm.title"
            placeholder="请输入公告标题"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content" required>
          <el-input
            v-model="addForm.content"
            style="width: 300px"
            :rows="12"
            type="textarea"
            placeholder="请输入公告内容"
          />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="dialog = false" type="info">取消</el-button>
        <el-button type="success" @click="addNotice">提交</el-button>
      </div>
    </div>
  </el-drawer>

  <!-- 编辑抽屉 -->
  <el-drawer
    ref="drawerRef"
    v-model="dialogEdit"
    title="更新公告"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form ref="updateFormRef" :model="updateForm" label-width="65px">
        <el-form-item label="ID" prop="id" required>
          <el-input v-model="updateForm.id" style="width: 300px" disabled />
        </el-form-item>
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="updateForm.title" style="width: 300px" />
        </el-form-item>
        <el-form-item label="内容" prop="content" required>
          <el-input
            v-model="updateForm.content"
            style="width: 300px"
            :rows="12"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="dialogEdit = false" type="info">取消</el-button>
        <el-button type="success" @click="updateNotice">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  getNoticeListApi,
  deleteNoticeApi,
  postAddNoticeApi,
  getNoticeDetailApi,
  putUpdateNoticeApi,
} from "@/api/common";
import PageQuery from "@/components/common/PageQuery.vue";
import { ElMessage } from "element-plus";

// 初始数据
const postForm = reactive({
  title: "",
  content: "", // 内容
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的公告信息数据
const tableData = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
const drawerRef = ref();
const addFormRef = ref();
const updateFormRef = ref();
// 控制抽屉是否显示--新增
const dialog = ref(false);
// 抽屉表单项--新增
const addForm = reactive({
  title: "",
  content: "",
});
const dialogEdit = ref(false);
// 抽屉表单项--编辑+回显
const updateForm = reactive({
  id: null,
  title: "",
  content: "",
});

onMounted(() => {
  pageQuery();
});

/**
 * 获取公告列表
 */
const pageQuery = async () => {
  try {
    console.log("🚀 ~ pageQuery ~ postForm:", postForm);
    var res = await getNoticeListApi(postForm);

    tableData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    console.log("🚀 ~ pageQuery ~ error:", error);
  }
};

/**
 * 新增
 */
const addNotice = () => {
  addFormRef.value.validate(async (valid, fileds) => {
    if (valid) {
      const res = await postAddNoticeApi(addForm);
      ElMessage.success(res.msg);
      dialog.value = false;
      pageQuery();
    } else {
      console.error("error submit!", fields);
    }
  });
};

/**
 * 编辑菜单回显
 */
const handleEdit = (item) => {
  console.log("🚀 ~ handleEdit ~ item:", item);

  Object.assign(updateForm, item);

  dialogEdit.value = true;
  // 侧边栏/对话框编辑
  // putUpdateNoticeApi
};

/**
 * 保存更新
 */

const updateNotice = () => {
  updateFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const res = await putUpdateNoticeApi(updateForm);
      ElMessage.success(res.msg);
      dialogEdit.value = false;
      pageQuery();
    } else {
      console.error("error submit!", fields);
    }
  });
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  // console.log("🚀 ~ handleDelete ~ item:", item);

  const { id } = item;

  try {
    const res = await deleteNoticeApi(id);

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
@import "@/assets/css/_var.scss";

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

.demo-drawer__footer {
  float: right;
  margin: 20px 25px;

  // & button:last-child {
  //   background-color: $button-color;
  //   border: 1px $theme-font-color;
  // }
}
</style>
