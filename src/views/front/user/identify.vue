<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>申请成为专业用户</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
      </div>
    </template>

    <div class="formContainer">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="ruleForm"
        label-position="top"
        :size="formSize"
        status-icon
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="ruleForm.id" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" disabled />
        </el-form-item>
        <el-form-item label="申请理由" prop="applyReasons">
          <el-input
            v-model="ruleForm.applyReasons"
            :autosize="{ minRows: 3, maxRows: 8 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="身份认证" prop="evidenceImg">
          <el-upload
            class="avatar-uploader"
            drag
            action="/api/upload/file"
            name="file"
            :show-file-list="false"
            :headers="{ Authorization: token }"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            style="margin-bottom: 20px"
          >
            <img
              v-if="ruleForm.evidenceImg"
              :src="ruleForm.evidenceImg"
              class="avatar"
            />
            <template v-else>
              <el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
              <div class="el-upload__text">拖动文件上传或<em>点击上传</em></div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
          <el-button type="primary" @click="changeIdentity()" id="submit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/useUserStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { postApplyAuthApi, getUserInfoApi } from "@/api/user.js";
import { ElMessage } from "element-plus";

const router = useRouter();
const { userInfo } = useUserStore();
const { token } = useTokenStore();
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 收集表单内容 + 回显
const ruleForm = reactive({
  id: userInfo.id,
  username: "",
  applyReasons: "",
  evidenceImg: "",
});
// 控制该表单内组件的尺寸
const formSize = ref("default");

/**
 * 获取用户信息
 */
 const getUserInfo = async () => {
  try {
    const res = await getUserInfoApi(userInfo.id);
    console.log("🚀 ~ getUserInfo ~ res:", res)

    // 回显
    Object.assign(ruleForm, res.data)

    if(ruleForm.status === 1) {
      ElMessage.warning("您的正在审核中[无需重复申请]")
    } else if (ruleForm.status === 3) {
      ElMessage.warning("您的申请被驳回[可重新申请]")
    }
  } catch (error) {
    console.log("🚀 ~ getUserInfo ~ error:", error);
  }
};
getUserInfo();

/**
 * 提交申请
 *  */
const changeIdentity = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await postApplyAuthApi(ruleForm);
        ElMessage.success(res.msg + "[即将为您跳转到首页]");
        setTimeout(() => {
          // 申请成功 跳回首页
          router.push("/index");
        }, 3000);
      } catch (error) {
        console.log("🚀 ~ ruleFormRef.value.validate ~ error:", error);
      }
    } else {
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};
/**
 * 文章图上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleSuccess = (response, uploadFile) => {
  console.log(response, uploadFile);
  ruleForm.evidenceImg = response.data;
  ElMessage.success(response.msg);
};

/**
 *  before-upload 钩子中限制资讯上传文件的格式和大小
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB!");
    return false;
  }
  return true;
};

// 表单验证
const rules = reactive({
  applyReasons: [
    {
      required: true,
      message: "请输入申请理由",
      trigger: "blur",
    },
    { min: 6, max: 12, message: "Length should be 6 to 12", trigger: "blur" },
  ],
  evidenceImg: [
    {
      required: true,
      message: "请上传申请证明",
      trigger: "blur",
    },
  ],
});
</script>

<style lang="scss" scoped>
.el-card {
  width: 80%;
  margin: 20px auto;

  .tableBar {
    color: #909399;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .formContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      width: 70%;
      position: relative;

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }

      #reset {
        position: absolute;
        right: 20px;
      }
      #submit {
        position: absolute;
        right: -60px;
      }
    }
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
  width: 400px;
  height: 80px;
  text-align: center;
}
</style>
