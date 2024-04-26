<template>
  <el-card>
    <template #header>
      <div class="tableBar">
        <span>个人信息</span>
        <el-button type="success" plain @click="router.back()">返回</el-button>
      </div>
    </template>

    <div class="formContainer">
      <el-form
        ref="ruleFormRef"
        :model="updateForm"
        :rules="rules"
        class="updateForm"
        label-position="top"
        :size="formSize"
        status-icon
        style="font-weight: bold; width: 60%"
      >
        <el-form-item label="用户头像" prop="avatar">
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
              v-if="updateForm.avatar"
              :src="updateForm.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="updateForm.id" disabled />
        </el-form-item>
        <el-form-item label="用户身份" prop="roleName" disabled >
          <el-input v-model="updateForm.roleName" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username" disabled/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="updateForm.nickname"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="updateDetail()" id="submit">
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  getUserInfoApi,
  updateUserDetailApi
} from "@/api/user";
import { emailReg } from "@/utils/regexp.js";
import { useTokenStore } from "@/stores/useTokenStore";
import { useUserStore } from "@/stores/useUserStore";

const { userInfo } = useUserStore();
const { token } = useTokenStore();
const router = useRouter();
// 控制该表单内组件的尺寸
const formSize = ref("default");
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 收集表单内容
const updateForm = reactive({});

onMounted(() => {
  getUserInfo();
});

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  try {
    const res = await getUserInfoApi(userInfo.id);

    // 回显
    Object.assign(updateForm, res.data);
  } catch (error) {
    console.log("🚀 ~ getUserInfo ~ error:", error);
  }
};

/**
 * 头像上传成功的回调
 * @param {*} response
 * @param {*} uploadFile
 */
const handleAvatarSuccess = async (response, uploadFile) => {
  updateForm.avatar = response.data;
  ElMessage.success(response.msg);
};

/**
 * 更新用户信息
 * @param {*} ruleFormRef
 */
const updateDetail = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 更新用户基础信息
      updateForm.userRole = updateForm.role.roleType;
      const res = await updateUserDetailApi(updateForm);

      ElMessage.success(res.msg + "![即将为您跳转到首页]");
      setTimeout(() => {
        // 成功 跳回首页
        router.push("/index");
      }, 3000);
    } else {
      // 【问题】后端在这里的验证无效
      ElMessage.error("表单数据不符合规则！");
      console.log(fields);
    }
  });
};

/**
 *  before-upload 钩子中限制用户上传文件的格式和大小
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("头像大小不能超过2MB!");
    return false;
  }
  return true;
};

/**
 * 邮箱验证规则
 */
const validatorEmail = (rule, value, callback) => {
  console.log(rule, value);

  if (value === null) {
    callback(new Error("邮箱不能为空"));
  } else if (!emailReg.test(value)) {
    callback(new Error("请输入合法的邮箱"));
    return;
  }
  return true;
};

// 表单验证
const rules = reactive({
  nickname: [
    {
      required: true,
      message: "昵称不能为空",
      trigger: "blur",
    },
    { min: 2, max: 12, message: "长度为2~12个字符", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      trigger: "blur",
      validator: validatorEmail,
    },
  ],
});

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};
</script>

<style scoped>
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
      position: relative;

      /* 头像 */
      .avatar-uploader {
        width: 200px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 90%;
          object-fit: contain;
        }
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
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
