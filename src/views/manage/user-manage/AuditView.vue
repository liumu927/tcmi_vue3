<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>用户审核</span>
      </div>
    </template>

    <!-- 搜索、新增行内表单 -->
    <el-form :inline="true" :model="postForm" class="form-inline">
      <el-form-item label="">
        <el-input
          v-model="postForm.username"
          style="width: 240px"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="pageQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表数据 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      row-key="id"
      max-height="400"
    >
      <el-table-column prop="username" label="用户名" width="100" />
      <el-table-column label="头像" style="width: 220px">
        <template #default="scope">
          <el-avatar :size="40" :src="scope.row.avatar" @error="errorHandler">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="userRole"
        :formatter="getRoleNameMap"
        label="角色名称"
      />
      <el-table-column prop="email" label="邮箱号" />
      <el-table-column prop="status" label="审核状态" width="150px">
        <template #default="scope">
          <el-tag :type="isType(scope.row.status)">
            {{ getStateMap(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedBy" label="审核人" />
      <el-table-column prop="updatedAt" label="最后操作时间" width="140" />

      <!-- 自定义：操作 -->
      <el-table-column label="操作" align="right" width="140px">
        <!-- 操作按钮 -->
        <template #default="scope">
          <el-button size="small" type="warning" @click="getDetail(scope.row)"
            >详情</el-button
          >

          <!-- confirm	点击确认按钮时触发 -->
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="handleDelete(scope.row)"
            confirm-button-text="是"
            cancel-button-text="否"
          >
            <template #reference>
              <el-button
                size="small"
                type="danger"
                :disabled="!!scope.row.isDefault"
                >删除</el-button
              >
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

  <!-- 审核框 -->
  <el-dialog v-model="dialogVisible" title="用户审核" width="50%">
    <el-form
      ref="applyFormRef"
      :model="applyFormData"
      class="ruleForm"
      style="font-weight: bold"
    >
      <el-form-item label="用户ID" prop="id">
        <el-input v-model="applyFormData.id" disabled />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="applyFormData.username" disabled />
      </el-form-item>
      <el-form-item label="申请理由" prop="applyReasons">
        <el-input
          v-model="applyFormData.applyReasons"
          :rows="3"
          type="textarea"
          placeholder="空空如也..."
          disabled
        />
      </el-form-item>
      <el-form-item label="申请证明" prop="evidenceImg">
        <el-image
          style="width: 100px; height: 100px"
          :src="applyFormData.evidenceImg"
          fit="cover"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="handleConfirm()">通过</el-button>
        <el-button type="danger" @click="handleRefused()">驳回</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import PageQuery from "@/components/common/PageQuery.vue";
import { onMounted, reactive, ref } from "vue";
import {
  getApplyListApi,
  deleteUserApi,
  applyApplicationApi,
  refusedApplicationApi,
} from "@/api/user";

// 初始数据
const postForm = reactive({
  username: "",
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的用户信息数据
const tableData = ref([]);
// 存储请求回来的数据总数
const total = ref(0);
// 控制编辑对话框的显示/不显示
const dialogVisible = ref(false);
// 审核框对象
const applyFormRef = ref();
// 审核框回显
const applyFormData = ref();

// 【问题】为什么在这里获取不到更新的值
// console.log(tableData.value);

onMounted(() => {
  pageQuery();
});


/**
 * 获取用户审核列表
 */
const pageQuery = async () => {
  try {
    var res = await getApplyListApi(postForm);

    tableData.value = res.data.items;
    total.value = res.data.total;

    // console.log(tableData.value);
  } catch (error) {
    ElMessage.error(error);
  }
};

/**
 * 审核框信息回显
 * @param {*} item
 */
const getDetail = (item) => {
  dialogVisible.value = true;

  applyFormData.value = item;
};

/**
 * 通过审核
 */
const handleConfirm = async () => {
  try {
    const res = await applyApplicationApi(applyFormData.value.id);
    ElMessage.success(res.msg);
    dialogVisible.value = false;
    pageQuery();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 不通过审核
 */
const handleRefused = async () => {
  try {
    const res = await refusedApplicationApi(applyFormData.value.id);
    pageQuery();
    dialogVisible.value = false;

    ElMessage.success(res.msg);
  } catch (error) {
    console.log(error);
  }
};

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
      return "驳回";
    default:
      return "正常";
  }
};

/**
 * 获取角色身份的映射
 * @param {*} row
 */
const getRoleNameMap = (row) => {
  const roleName = row.userRole;
  switch (roleName) {
    case 302:
      return "专业用户";
    case 303:
      return "普通用户";
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
  postForm.pageNum = pageNumVal.pageNum;
  pageQuery();
};

/**
 * 图片加载失败时的回退行为
 */
const errorHandler = () => true;

/**
 * 删除
 */
const handleDelete = async (item) => {
  const { id } = item;

  try {
    const res = await deleteUserApi(id);

    // 重新取一遍数据，渲染页面
    await pageQuery();
    ElMessage.success(res.msg);
  } catch (error) {
    console.log(error);
  }
};
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

// 表单
.el-dialog .el-form-item {
  width: 90%;

  :deep(.el-form-item__label) {
    width: 75px;
    justify-content: flex-start;
  }
}
</style>
