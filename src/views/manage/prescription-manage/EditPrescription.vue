<template>
  <TopBar></TopBar>

  <el-card>
    <template #header>
      <div class="tableBar">
        <span v-if="getPrescriptionId">方剂更新页</span>
        <span v-else>新增方剂页</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
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
      <el-form-item label="方剂名称" prop="prescriptionName" required>
        <el-input v-model="updateForm.prescriptionName" />
      </el-form-item>
      <el-form-item label="方剂状态" prop="status" required>
        <el-select v-model="updateForm.status">
          <el-option
            v-for="item in statusList"
            :key="item.status"
            :label="item.statusTag"
            :value="item.status"
          />
        </el-select>
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
      <el-form-item label="功效" prop="effects" required>
        <el-input v-model="updateForm.effects" />
      </el-form-item>
      <el-form-item label="组成" prop="composition">
        <el-input v-model="updateForm.composition" />
      </el-form-item>
      <el-form-item label="用法" prop="prescriptionUsage">
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
      <el-form-item label="药材组成" prop="prescriptionMedicines">
        <el-select
          v-model="updateForm.selectMedIds"
          @click="getMedAllList"
          multiple
          filterable
          placeholder="请选择方剂主要成分"
        >
          <el-option
            v-for="item in medicinesList"
            :key="item.medicineId"
            :label="item.medicineName"
            :value="item.medicineId"
          />
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button v-if="getPrescriptionId" type="success" @click="updateDetail"
          >保存更新</el-button
        >
        <el-button v-else type="success" @click="addPrescription"
          >新增</el-button
        >
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
  getPreDetailApi,
  getPreCategoryListApi,
  putUpdPrescriptionApi,
  postAddPrescriptionApi,
} from "@/api/prescription";
import { getMedecineAllListApi } from "@/api/medicine";

const router = useRouter();
const route = useRoute();
const { token } = useTokenStore();

// 接收通过路由跳转传过来的方剂ID
const getPrescriptionId = route.query.prescriptionId;
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 存放分类列表
const categorysList = ref([]);
// 存放全部药材
const medicinesList = ref([]);
// 收集表单内容同时用于回显
const updateForm = reactive({
  prescriptionId: null,
  prescriptionName: "",
  status: null,
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
  prescriptionMedicines: [], // 收集后端返回的药材组成数据
  selectMedIds: [], // 存储用户选择的药材ID
});
// 存放审核状态列表
const statusList = reactive([
  { status: 0, statusTag: "正常" },
  { status: 1, statusTag: "待审核" },
  { status: 2, statusTag: "审核通过" },
  { status: 3, statusTag: "被驳回" },
]);

onMounted(() => {
  // 更新操作，用于回显
  if (getPrescriptionId) {
    getPreInfo();
  }
  getCategoryList();
  getMedAllList();
});

/**
 * 获取全部药材列表
 */
const getMedAllList = async () => {
  try {
    const res = await getMedecineAllListApi();
    medicinesList.value = res.data;
  } catch (error) {
    // console.log("🚀 ~ getMedAllList ~ error:", error);
  }
};

/**
 * 获取方剂详细信息
 */
const getPreInfo = async () => {
  try {
    const res = await getPreDetailApi(getPrescriptionId);

    // 回显
    Object.assign(updateForm, res.data);

    // 将返回的药材组成存到一个数组中，用于表单回显
    updateForm.selectMedIds = res.data.prescriptionMedicines.map(
      (med) => med.medicineId
    );
  } catch (error) {
    // console.log("🚀 ~ getPreInfo ~ error:", error);
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
    // console.log("🚀 ~ getCategoryList ~ error:", error);
  }
};

/**
 * 新增方剂
 */
const addPrescription = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    // 封装方剂的药材组成，将selectMedIds中的药材id重新封装到prescriptionMedicines中（会覆盖原有的数据！但这是我想要的）
    // 遍历数组，将每个元素转换成一个对象，包含一个属性medicineId，值为元素的值
    let pMs = updateForm.selectMedIds.map((id) => {
      return {
        medicineId: parseInt(id),
      };
    });
    updateForm.prescriptionMedicines = pMs;

    console.log(pMs);

    // console.log("🚀 ~ ruleFormRef.value.validate ~ updateForm:", updateForm);
    if (valid) {
      // 新增
      const res = await postAddPrescriptionApi(updateForm);
      ElMessage.success(res.msg);
      // 跳转回方剂列表页
      router.push("/manage/prescription_manage/message");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 * 更新方剂信息
 */
const updateDetail = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    // 封装方剂的药材组成，将selectMedIds中的药材id重新封装到prescriptionMedicines中（会覆盖原有的数据！但这是我想要的）
    // 遍历数组，将每个元素转换成一个对象，包含一个属性medicineId，值为元素的值
    let pMs = updateForm.selectMedIds.map((id) => {
      return {
        medicineId: parseInt(id),
      };
    });
    updateForm.prescriptionMedicines = pMs;

    console.log(pMs);

    if (valid) {
      // console.log("🚀 ~ ruleFormRef.value.validate ~ updateForm:", updateForm);

      // 更新
      const res = await putUpdPrescriptionApi(updateForm);
      ElMessage.success(res.msg);
      // 跳转回方剂列表页
      router.push("/manage/prescription_manage/message");
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
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
