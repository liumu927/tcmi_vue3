<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>我的贡献</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
      </div>
    </template>

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

  <el-card>
    <template #header>
      <div class="tableBar">
        <span>贡献方剂</span>
      </div>
    </template>

    <!-- 方剂项 -->
    <el-form
      ref="ruleFormRef"
      :model="updateForm"
      class="updateForm"
      label-position="top"
      size="default"
      status-icon
      style="font-weight: bold; width: 60%; margin: 0 auto"
    >
      <el-form-item label="图示" prop="imgUrl">
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
            v-if="updateForm.imgUrl"
            :src="updateForm.imgUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="方剂ID" prop="prescriptionId">
        <el-input
          v-model="updateForm.prescriptionId"
          disabled
          placeholder="您无需填写，我们帮您解决"
        />
      </el-form-item>
      <el-form-item label="方剂状态" prop="status" required>
        <el-input placeholder="待审核" disabled></el-input>
      </el-form-item>
      <el-form-item label="方剂名称" prop="prescriptionName" required>
        <el-input v-model="updateForm.prescriptionName" />
      </el-form-item>
      <el-form-item label="方剂分类" prop="preTypeId" required>
        <el-select v-model="updateForm.preTypeId">
          <el-option
            v-for="item in categorysList"
            :key="item.preTypeId"
            :label="item.preTypeName"
            :value="item.preTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="方剂归经" prop="origin">
        <el-input v-model="updateForm.origin" />
      </el-form-item>
      <el-form-item label="方剂功效" prop="effects" required>
        <el-input v-model="updateForm.effects" />
      </el-form-item>
      <el-form-item label="方剂成分" prop="composition" required>
        <el-input v-model="updateForm.composition" />
      </el-form-item>
      <el-form-item label="方剂用法" prop="prescriptionUsage" required>
        <el-input v-model="updateForm.prescriptionUsage" />
      </el-form-item>
      <el-form-item label="临床应用" prop="application">
        <el-input v-model="updateForm.application" />
      </el-form-item>
      <el-form-item label="适用人群" prop="applicableCrowd">
        <el-input v-model="updateForm.applicableCrowd" />
      </el-form-item>
      <el-form-item label="禁忌症" prop="contraindications">
        <el-input v-model="updateForm.contraindications" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="success" @click="addPrescription">新增</el-button>
        <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import { useTokenStore } from "@/stores/useTokenStore";
import { Plus } from "@element-plus/icons-vue";
import {
  getPreCategoryListApi,
  postAuthAddPreApi,
  getPreListApi,
  delPrescriptionApi
} from "@/api/prescription";
import { useUserStore } from "@/stores/useUserStore";

const { userInfo } = useUserStore();
const router = useRouter();
const { token } = useTokenStore();
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 存放分类列表
const categorysList = ref([]);
// 收集表单内容
const updateForm = reactive({
  prescriptionId: null,
  prescriptionName: "",
  status: 1,
  imgUrl: "",
  preTypeId: null,
  preTypeName: "",
  origin: "",
  effects: "",
  composition: "",
  prescriptionUsage: "",
  application: "",
  applicableCrowd: "",
  contraindications: "",
});
// 存储 我的上传方剂列表
const tableData = ref([]);
// 查列表的初始数据
const postForm = reactive({
  createdBy: userInfo.username,
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页的记录数
});
// 存储请求回来的数据总数
const total = ref(0);

onMounted(() => {
  getCategoryList();
  pageQuery();
});

const handleChange = (val) => {
  console.log(val);
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
 * 获取专业用户的上传列表 分页
 */
const pageQuery = async () => {
  try {
    // console.log("🚀 ~ pageQuery ~ postForm:", postForm);
    var res = await getPreListApi(postForm);

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
    var res = await getPreCategoryListApi();
    categorysList.value = res.data;
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 新增方剂
 */
const addPrescription = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    console.log("🚀 ~ ruleFormRef.value.validate ~ updateForm:", updateForm);
    if (valid) {
      // 新增
      const res = await postAuthAddPreApi(updateForm);
      ElMessage.success(res.msg + "![即将为您跳转到首页]");
      setTimeout(() => {
        // 成功 跳回首页
        router.push("/index");
      }, 3000);
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
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
    console.log("🚀 ~ handleDelete ~ error:", error);
  }
};

/**
 * 分页器--当前页的数据量
 */
const handlePageSize = (pageSizeVal) => {
  // console.log("🚀 ~ handlePageSize ~ pageSizeVal:", pageSizeVal)

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

/**
 * 图示上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAvatarSuccess = (response, uploadFile) => {
  updateForm.imgUrl = response.data;
  ElMessage.success(response.msg);
};

/**
 *  before-upload 钩子中限制方剂上传文件的格式和大小
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB!");
    return false;
  }
  return true;
};

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};

/**
 * 图片加载失败时的回退行为
 */
const errorHandler = () => true;
</script>

<style lang="scss" scoped>
.el-card {
  width: 80%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .tableBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
