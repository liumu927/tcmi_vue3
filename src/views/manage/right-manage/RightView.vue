<template>
  <el-table :data="tableData" stripe style="width: 100%" row-key="id">
    <el-table-column prop="title" label="权限" width="220" />
    <!-- 自定义：图标 -->
    <el-table-column label="图标" width="180">
      <!-- 插槽 # #default是一个命名插槽 -->
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon>
            <!-- scope变量包含了当前行的所有数据
              scope.row：访问到当前行的数据对象 -->
            <component :is="mapIcon[scope.row.icon]"></component>
          </el-icon>
        </div>
      </template>
    </el-table-column>
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
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑框 -->
  <el-dialog v-model="dialogVisible" title="权限编辑" width="50%">
    <el-form
      ref="updateFormRef"
      :model="updateForm"
      :rules="rules"
      class="ruleForm"
      label-position="top"
      style="font-weight: bold"
    >
      <el-form-item label="权限名称" prop="title">
        <el-input v-model="updateForm.title" />
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
import { onMounted, reactive, ref } from "vue";
import {
  HomeFilled,
  Avatar,
  UserFilled,
  User,
  Platform,
  Lock,
  HelpFilled,
  Filter,
  List,
  Connection,
  Operation,
  DataAnalysis,
  Aim,
  Service,
  PieChart,
  House,
  Reading,
  Files,
  Tickets,
  Headset,
  Message,
  Star,
  Upload,
  Postcard,
} from "@element-plus/icons-vue";
import { getAllRightsApi, getManageRightsApi,putRightsApi, delRightApi } from "@/api/rights.js";

onMounted(() => {
  getRightsList();
});

const tableData = ref([]);
// 编辑对话框中绑定的表单数据
const updateFormRef = ref();
// 控制编辑对话框的显示/不显示
const dialogVisible = ref(false);
const updateForm = reactive({
  title: "",
});
// 收集点击"编辑"时获得的内容
const currentItem = ref({});

// 映射图标
const mapIcon = {
  HomeFilled,
  Avatar,
  UserFilled,
  Platform,
  User,
  Lock,
  HelpFilled,
  Filter,
  List,
  Connection,
  Operation,
  DataAnalysis,
  Aim,
  Service,
  PieChart,
  House,
  Reading,
  Files,
  Tickets,
  Headset,
  Message,
  Star,
  Upload,
  Postcard,
};

// 获取权限列表
const getRightsList = async () => {
  try {
    var res = await getAllRightsApi();
    tableData.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 编辑
const handleEdit = (item) => {
  // 传进来一个proxy对象
  // console.log(item);

  // 收集点击后获得的对象
  currentItem.value = item;
  updateForm.title = item.title;
  console.log(updateForm);

  dialogVisible.value = true;
};

// 编辑时，表单验证规则
const rules = reactive({
  title: [
    {
      required: true,
      message: "Please input the permission name",
      trigger: "blur",
    },
    { min: 2, max: 6, message: "Length should be 2 to 6", trigger: "blur" },
  ],
  icon: [
    {
      required: true,
      message: "Please update the icon",
      trigger: "blur",
    },
    { trigger: "blur" },
  ],
});

// 编辑完毕 保存时强行验证
const handleConfirm = () => {
  // validate：任一表单项被校验后触发
  // 注意，这里需要 .value ，因为没有通过点击传值过来
  updateFormRef.value.validate(async (valid, fields) => {
    // console.log(valid, fields);

    if (valid) {
      try {
        // 向后端发送更新请求：带参数
        const res = await putRightsApi(currentItem.value.id, updateForm);
        ElMessage.success(res.msg);

        // 关闭对话框
        dialogVisible.value = false;

        // 重新渲染页面
        await getRightsList();

        // 【待优化】更新数据后，侧边栏没有同步
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
  const { id } = item;

  try {
  const res = await delRightApi(id);
  ElMessage.success(res.msg);
  
    // 重新取一遍数据，渲染页面
    await getRightsList();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped></style>
