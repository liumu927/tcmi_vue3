<template>
  <div class="tableBar">
    <el-input
      v-model="postForm.username"
      style="width: 240px"
      placeholder="请输入用户名"
    />
    <el-button type="success" @click="pageQuery">搜索</el-button>
    <el-button type="success" @click="handleAdd" :icon="Plus"
      >新增用户</el-button
    >
  </div>

  <!-- 用户列表数据 -->
  <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    row-key="id"
    height="380"
  >
    <el-table-column prop="username" label="用户名" width="100" />
    <el-table-column label="头像">
      <template #default="scope">
        <el-avatar :size="40" :src="scope.row.avatar" @error="errorHandler">
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
      </template>
    </el-table-column>
    <el-table-column prop="role.roleName" label="角色名称" />
    <el-table-column prop="email" label="邮箱号" />
    <el-table-column prop="updatedAt" label="最后操作时间" />

    <!-- 自定义：操作 -->
    <el-table-column label="操作" align="right">
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

  <!-- 分页器 -->
  <PageQuery
    :total="total"
    :pageNum="postForm.pageNum"
    :pageSize="postForm.pageSize"
    @page-size="handlePageSize"
    @page-num="handlePageNum"
  ></PageQuery>

  <!-- 抽屉——新增用户 -->
  <!-- 【待优化】关闭面板销毁组件 -->
  <el-drawer
    ref="drawerRef"
    v-model="dialog"
    title="新增用户"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="65px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-select
            v-model="addForm.userRole"
            placeholder="请选择用户身份"
            style="width: 240px"
          >
            <el-option
              v-for="item in roleList"
              :key="item.roleType"
              :label="item.roleName"
              :value="item.roleType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addForm.email"
            placeholder="请输入邮箱"
            style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="addUser">提交</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  getUserListByPageQueryApi,
  deleteUserApi,
  postAddUserApi,
} from "@/api/user";
import { getRolesListApi } from "@/api/role";
import { emailReg } from "@/utils/regexp.js";
import { useRouter } from "vue-router";
import PageQuery from "@/components/common/PageQuery.vue";

// 路由
const router = useRouter();
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
const drawerRef = ref();
const addFormRef = ref();
// 控制抽屉是否显示
const dialog = ref(false);
// 抽屉表单项--新增用户
const addForm = reactive({
  username: "",
  email: "",
  avatar: "",
  userRole: 300,
});
// 存放角色列表
const roleList = ref([]);

onMounted(() => {
  pageQuery();
});

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

/**
 * 获取用户列表
 */
const pageQuery = async () => {
  // 封装请求分页时的参数
  const params = {
    pageNum: postForm.pageNum,
    pageSize: postForm.pageSize,
    username: postForm.username,
  };
  try {
    var res = await getUserListByPageQueryApi(params);

    tableData.value = res.data.items;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error(error);
  }
};

/**
 * 图片加载失败时的回退行为
 */
const errorHandler = () => true;

/**
 * 触发新增面板
 */
const handleAdd = () => {
  dialog.value = true;
  getRolesList();
};

/**
 *  获取角色列表
 */
const getRolesList = async () => {
  try {
    var res = await getRolesListApi();
    roleList.value = res.data.slice(1);
    // console.log(roleList.value);
  } catch (error) {
    ElMessage.error(error);
  }
};

/**
 * 新增用户，发送请求
 */
const addUser = async () => {
  // console.log(addForm);

  // 封装表单数据
  const params = {
    username: addForm.username,
    email: addForm.email,
    avatar: addForm.avatar,
    userRole: addForm.userRole,
  };

  try {
    // 发送请求
    const res = await postAddUserApi(params);
    ElMessage.success(res.msg);

    // 重新请求用户列表
    await getRolesList();
  } catch (error) {
    console.log(error);
  }
  dialog.value = false;
};

/**
 * 编辑
 */
const handleEdit = (item) => {
  // console.log(item);

  if (item.role.roleType === 300) {
    ElMessage.error("该账号为超级管理员账号，不能修改！");
    return;
  }

  // 跳转编辑页--携带数据
  router.push({
    name: "editUser",
    query: { userId: item.id },
  });
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  // console.log(item);
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

/**
 * 邮箱验证规则
 */
const validatorEmail = (rule, value, callback) => {
  // console.log(rule, value);

  if (!value) {
    return true;
  } else if (!emailReg.test(value)) {
    callback(new Error("请输入合法的邮箱"));
    return;
  }
};

// 验证表单规则
const rules = reactive({
  username: [
    {
      required: true,
      message: "请输入合法的用户名",
      trigger: "blur",
    },
    { min: 2, max: 12, message: "用户名长度为2~12个字符", trigger: "blur" },
  ],
  email: [
    {
      trigger: "blur",
      validator: validatorEmail,
    },
  ],
});
</script>

<style lang="scss" scoped>
.tableBar {
  background-color: #fff;
  padding: 10px 20px;
  color: #909399;
  font-weight: bold;

  .el-button {
    margin-left: 20px;
  }
}
</style>
