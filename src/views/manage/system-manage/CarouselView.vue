<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>轮播图列表</span>
        <el-button type="success" @click="dialog = true" :icon="Plus"
          >新增封面</el-button
        >
      </div>
    </template>

    <el-table :data="tableData" stripe style="width: 100%">
    <!-- 数据 -->
    <el-table-column label="图片">
      <template #default="scope">
        <el-avatar :size="40" :src="scope.row.coverImg" @error="errorHandler">
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="描述" show-overflow-tooltip />
    <el-table-column prop="updatedBy" label="操作人" />
    <el-table-column prop="updatedAt" label="最后操作时间" />
    <!-- 操作 -->
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
  </el-card>

  <!-- 编辑框 -->
  <el-dialog v-model="dialogVisible" title="封面编辑" width="50%">
    <el-form
      ref="updateFormRef"
      :model="updateForm"
      class="ruleForm"
      style="font-weight: bold"
    >
      <el-form-item label="图片ID" prop="coverId">
        <el-input v-model="updateForm.coverId" disabled />
      </el-form-item>
      <el-form-item label="图片描述" prop="description">
        <el-input
          v-model="updateForm.description"
          :rows="3"
          type="textarea"
          placeholder="空空如也..."
        />
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImg" required>
        <el-upload
          class="avatar-uploader"
          action="/api/upload/file"
          name="file"
          :show-file-list="false"
          :headers="{ Authorization: token }"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="updateForm.coverImg"
            :src="updateForm.coverImg"
            class="coverImg"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm()"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加框 -->
  <el-dialog v-model="dialog" title="封面编辑" width="50%">
    <el-form
      ref="addFormRef"
      :model="addForm"
      class="ruleForm"
      style="font-weight: bold"
    >
      <el-form-item label="封面图片" prop="coverImg" required>
        <el-upload
          class="avatar-uploader"
          action="/api/upload/file"
          name="file"
          :show-file-list="false"
          :headers="{ Authorization: token }"
          :on-success="handleAddSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="addForm.coverImg"
            :src="addForm.coverImg"
            class="coverImg"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片描述" prop="description" required>
        <el-input
          v-model="addForm.description"
          :rows="3"
          type="textarea"
          placeholder="空空如也..."
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm()"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import {
  getCoverListApi,
  putUpdateCoverApi,
  deleteCoverApi,
  postAddCoverApi,
} from "@/api/common.js";
import { useTokenStore } from "@/stores/useTokenStore";
import { Plus } from "@element-plus/icons-vue";

const { token } = useTokenStore();
// 存放图片信息列表
const tableData = ref([]);
// 编辑对话框中绑定的表单数据，用于校验
const updateFormRef = ref();
const addFormRef = ref();
// 更新字段, 收集表单内容
const updateForm = reactive({
  coverId: null,
  coverImg: "",
  description: "",
});
// 新增字段, 收集表单内容
const addForm = reactive({
  coverImg: "",
  description: "",
});
// 控制编辑对话框的显示隐藏
const dialogVisible = ref(false);
// 控制新增对话框的显示隐藏
const dialog = ref(false);

onMounted(() => {
  getCoverList();
});

/**
 * 获取轮播图列表
 */
const getCoverList = async () => {
  try {
    var res = await getCoverListApi();

    tableData.value = res.data;

    // console.log(tableData.value);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 保存新增
 */
const handleAddConfirm = () => {
  addFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //发送请求
      const res = await postAddCoverApi(addForm);

      ElMessage.success(res.msg);

      dialog.value = false;

      await getCoverList();
    }
  });
};

/**
 * 点击编辑并回显
 */
const handleEdit = (item) => {
  // console.log(item);

  updateForm.coverId = item.coverId;
  updateForm.coverImg = item.coverImg;
  updateForm.description = item.description;

  // 控制对话框显示
  dialogVisible.value = true;
};

/**
 * 保存编辑
 */
const handleConfirm = () => {
  console.log(updateForm);

  updateFormRef.value.validate(async (valid, fields) => {
    // console.log(valid, fields);

    if (valid) {
    } else {
    }
  });
};

/**
 * 删除
 */
const handleDelete = async (item) => {
  const { coverId } = item;

  try {
    const res = await deleteCoverApi(coverId);

    ElMessage.success(res.msg);

    await getCoverList();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 图片上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  updateForm.coverImg = response.data;
  ElMessage.success(response.msg);
};
const handleAddSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  addForm.coverImg = response.data;
  ElMessage.success(response.msg);
};

/**
 *  before-upload 钩子中限制用户上传文件的格式和大小
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小不能超过2MB!");
    return false;
  }
  return true;
};

/**
 * 图片加载失败时的回退行为
 */
const errorHandler = () => true;
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

// 编辑表单
.el-form-item {
  width: 500px;

  :deep(.el-form-item__label) {
    width: 80px;
    justify-content: flex-start;
  }

  .coverImg {
    width: 100px;
    height: 100px;
  }
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
