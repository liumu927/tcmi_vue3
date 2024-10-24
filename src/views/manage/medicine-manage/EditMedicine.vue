<template>
  <TopBar></TopBar>

  <el-card>
    <template #header>
      <div class="tableBar">
        <span v-if="getMedicineId">药材更新页</span>
        <span v-else>新增药材页</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
      </div>
    </template>

    <!-- 药材项 -->
    <el-form
      ref="ruleFormRef"
      :model="updateForm"
      class="updateForm"
      label-position="top"
      size="default"
      status-icon
      style="font-weight: bold; width: 60%; margin: 0 auto"
    >
      <el-form-item label="图示" prop="medicineImg">
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
            v-if="updateForm.medicineImg"
            :src="updateForm.medicineImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="药材ID" prop="medicineId">
        <el-input
          v-model="updateForm.medicineId"
          disabled
          placeholder="您无需填写，我们帮您解决"
        />
      </el-form-item>
      <el-form-item label="药材名称" prop="medicineName" required>
        <el-input v-model="updateForm.medicineName" />
      </el-form-item>
      <el-form-item label="药材别名" prop="medicineAlias">
        <el-input v-model="updateForm.medicineAlias" />
      </el-form-item>
      <el-form-item label="药材类别" prop="medicineTypeId" required>
        <el-select v-model="updateForm.medicineTypeId">
          <el-option
            v-for="item in categorysList"
            :key="item.medicineTypeId"
            :label="item.medicineTypeName"
            :value="item.medicineTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="药材归经" prop="origin">
        <el-input v-model="updateForm.origin" />
      </el-form-item>
      <el-form-item label="产地分布" prop="originDistribution">
        <el-input v-model="updateForm.originDistribution" />
      </el-form-item>
      <el-form-item label="药用部位" prop="medicinalParts">
        <el-input v-model="updateForm.medicinalParts" />
      </el-form-item>
      <el-form-item label="药材性状" prop="analysis">
        <el-input v-model="updateForm.analysis" />
      </el-form-item>
      <el-form-item label="功效与作用" prop="effects" required>
        <el-input v-model="updateForm.effects" />
      </el-form-item>
      <el-form-item label="常用配方推荐" prop="commonPrescriptions">
        <el-input v-model="updateForm.commonPrescriptions" />
      </el-form-item>
      <el-form-item label="临床应用" prop="application">
        <el-input v-model="updateForm.application" />
      </el-form-item>
      <el-form-item label="使用禁忌" prop="usageTaboo" required>
        <el-input v-model="updateForm.usageTaboo" />
      </el-form-item>
      <el-form-item label="参考价格" prop="referencePrice">
        <el-input v-model="updateForm.referencePrice" />
      </el-form-item>
      <el-form-item label="药材化学成分" prop="chemicalStructure">
        <el-input v-model="updateForm.chemicalStructure" />
      </el-form-item>
      <el-form-item label="化学结构图" prop="structureImg">
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
            v-if="updateForm.structureImg"
            :src="updateForm.structureImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="药理研究" prop="biologicalRelated">
        <el-input v-model="updateForm.biologicalRelated" />
      </el-form-item>
      <el-form-item label="药材备注" prop="comment">
        <el-input v-model="updateForm.comment" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button v-if="getMedicineId" type="success" @click="updateDetail"
          >保存更新</el-button
        >
        <el-button v-else type="success" @click="addMedicine">新增</el-button>
        <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <Footer></Footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import TopBar from "@/components/common/TopBar.vue";
import { useTokenStore } from "@/stores/useTokenStore";
import { Plus } from "@element-plus/icons-vue";
import {
  getMedicineDetailApi,
  postUpdMedicineApi,
  getMedCategoryListApi,
  postAddMedicineApi,
} from "@/api/medicine";

const router = useRouter();
const route = useRoute();
const { token } = useTokenStore();

// 接收通过路由跳转传过来的药材ID
const getMedicineId = route.query.medicineId;
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 存放分类列表
const categorysList = ref([]);
// 收集表单内容并用于回显
const updateForm = reactive({
  medicineId: null,
  medicineName: "",
  medicineAlias: "",
  medicineImg: "",
  medicineTypeId: null,
  origin: "",
  originDistribution: "",
  medicinalParts: "",
  analysis: "",
  effects: "",
  commonPrescriptions: "",
  application: "",
  usageTaboo: "",
  referencePrice: "",
  chemicalStructure: "",
  structureImg: "",
  biologicalRelated: "",
  comment: ""
});

onMounted(() => {
  // 更新操作，用于回显
  if (getMedicineId) {
    getMedInfo();
  }
  getCategoryList();
});

/**
 * 获取药材信息
 */
const getMedInfo = async () => {
  try {
    const res = await getMedicineDetailApi(getMedicineId);
    console.log("🚀 ~ getMedInfo ~ res:", res);

    // 【待优化】这里能否不一个个赋值？
    // Object.assign()方法将一个对象的属性复制到另一个对象中，如果属性名相同，则后面的对象会覆盖前面的对象的属性值。

    // 回显
    Object.assign(updateForm, res.data);
  } catch (error) {
    console.log("🚀 ~ getMedInfo ~ error:", error);
  }
};

/**
 *  获取分类列表
 */
const getCategoryList = async () => {
  try {
    var res = await getMedCategoryListApi();
    categorysList.value = res.data;

    console.log("🚀 ~ getCategoryList ~ categorysList:", categorysList);
  } catch (error) {
    console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 图示上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  updateForm.medicineImg = response.data;
  ElMessage.success(response.msg);
};
/**
 * 化学结构图上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAddSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  updateForm.structureImg = response.data;
  ElMessage.success(response.msg);
};

/**
 * 新增药材
 */
const addMedicine = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 新增
      const res = await postAddMedicineApi(updateForm);

      ElMessage.success(res.msg);

      // 跳转回药材列表页
      router.push("/manage/medicine_manage/message");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 * 更新药材信息
 */
const updateDetail = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 更新
      const res = await postUpdMedicineApi(updateForm);
      ElMessage.success(res.msg);

      // 跳转回药材列表页
      router.push("/manage/medicine_manage/message");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 *  before-upload 钩子中限制药材上传文件的格式和大小
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
  .avatar {
    height: 100%;
    width: 70%;
    object-fit: cover;
    margin-bottom: 5px;
    border-radius: 10px;
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
