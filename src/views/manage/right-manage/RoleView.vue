<template>

<el-card>
    <template #header>
      <div class="tableBar">
        <span>角色列表</span>
      </div>
    </template>

    <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column
      prop="roleName"
      label="角色名称"
  
      trigger="hover"
    >
      <template #default="scope">
        <!-- 角色对应的权限列表 -->
        <el-popover
          popper-class="el_popover_class"
          placement="right"
          title="权限详情"
          width="200"
          trigger="hover"
          @before-enter="handleHover(scope.row)"
        >
          <template #reference>
            <el-link>{{ scope.row.roleName }}</el-link>
          </template>
          <!-- 插槽 触发Popover 内嵌 HTML 文本-->
          <template #default>
            <el-tree
              style="max-width: 600px"
              :data="rightListAll"
              :props="defaultProps"
              :default-expand-all="true"
              :render-content="renderContent"
            />
          </template>
        </el-popover>
      </template>
    </el-table-column>

    <!-- 自定义：操作 -->
    <el-table-column label="操作">
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
  <el-dialog v-model="dialogVisible" title="角色编辑" width="50%">
    <el-form
      ref="updateFormRef"
      :model="updateForm"
      :rules="rules"
      class="ruleForm"
      style="font-weight: bold"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="updateForm.roleName" />
      </el-form-item>
      <el-form-item label="角色权限" prop="rights">
        <el-tree
          :data="rightListAll"
          :props="defaultProps"
          show-checkbox
          node-key="path"
          ref="treeRef"
          :check-strictly="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm()"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getRolesListApi,
  putUpdateRoleApi,
  delOneRoleApi,
} from "@/api/role.js";
import { getAllRightsApi } from "@/api/rights.js";

onMounted(() => {
  getRolesList();
  getRightsList();
});

// 存放角色列表
const tableData = ref([]);
// 存放角色对应的权限
const roleRights = ref([]);
// 存放全部权限
const rightListAll = ref([]);
// 指定读取的字段
const defaultProps = {
  children: "children",
  label: "title",
};
// 编辑对话框中绑定的表单数据，用于校验
const updateFormRef = ref();
// 控制编辑对话框的显示/不显示
const dialogVisible = ref(false);
// 字段
const updateForm = reactive({
  roleName: "",
});
// 收集点击"编辑"时获得的内容
const currentItem = ref({});
// 更新tree
const treeRef = ref();

// 获取角色列表
const getRolesList = async () => {
  try {
    var res = await getRolesListApi();
    tableData.value = res.data;

    // console.log(res);
  } catch (error) {
    console.log(error);
  }
};
// 获取前后台所有权限
// 【优化】在鼠标hover时再请求
const getRightsList = async () => {
  try {
    // 【优化】进入后台页面就请求了所有的数据，想办法复用，少发一次请求【解决】
    // var manage = await getRightsApi("manage");
    // var front = await getRightsApi("front");

    // console.log(manage.concat(front));
    // rightListAll.value = manage.concat(front);

    var allRights = await getAllRightsApi();
    rightListAll.value = allRights.data;
  } catch (error) {
    console.log(error);
  }
};

// 获取角色具有的权限
const handleHover = ({ rights }) => {
  roleRights.value = rights;
};

// 自定义tree节点的回调函数：添加类名
const renderContent = (h, { node, data, store }) => {
  return h(
    "span",
    {
      class: `${roleRights.value.includes(data.path) ? "active" : "without"}`,
    },
    h("span", null, node.label)
  );
};

// 编辑
const handleEdit = (item) => {
  // console.log(item);

  dialogVisible.value = true;

  currentItem.value = item;
  updateForm.roleName = item.roleName;

  // 设置rights给tree，需要使用到nextTick异步执行
  nextTick(() => {
    // console.log(Object.prototype.toString.call(JSON.parse(item.rights)));
    treeRef.value.setCheckedKeys(JSON.parse(item.rights));
  });
};

// 编辑时，表单验证规则
const rules = reactive({
  roleName: [
    {
      required: true,
      message: "Please input the role name",
      trigger: "blur",
    },
    { min: 2, max: 6, message: "Length should be 2 to 6", trigger: "blur" },
  ],
});

// 编辑完毕，更新角色及其权限，保存时强行验证
const handleConfirm = () => {
  // validate：任一表单项被校验后触发
  // 注意，这里需要 .value ，因为没有通过点击传值过来
  updateFormRef.value.validate(async (valid, fields) => {
    // console.log(valid, fields);
    if (valid) {
      try {
        // 向后端发送更新请求：带参数
        // 若节点可用被选中 (show-checkbox 为 true), getCheckedKeys将返回当前选中节点 key 的数组
        const res = await putUpdateRoleApi(currentItem.value.roleType, {
          roleName: updateForm.roleName,
          rights: JSON.stringify(treeRef.value.getCheckedKeys()),
        });

        ElMessage.success(res.msg);

        // 关闭对话框
        dialogVisible.value = false;

        // 重新渲染页面
        await getRolesList();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("error submit!", fields);
    }
  });
};

// 删除
const handleDelete = async (item) => {
  // console.log(item);

  const { roleType } = item;

  const res = await delOneRoleApi(roleType);

  ElMessage.success(res.msg);

  // 重新取一遍数据，渲染页面
  await getRolesList();
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

// Popover 需要开启深度选择，否则不生效
:deep(.active) {
  color: #32cd32;
}
:deep(.without) {
  color: #dcdcdc;
}
</style>
