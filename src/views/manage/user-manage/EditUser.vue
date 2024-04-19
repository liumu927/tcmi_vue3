<template>
  <TopBar></TopBar>
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
      <el-form-item label="用户头像" prop="evidence">
        <!-- 
          auto-upload:设置是否自动上传
          action:设置服务器接口路径
          name:设置上传的文件字段名
          headers:设置上传的请求头
          on-success:设置上传成功的回调函数 -->
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
      <el-form-item label="用户身份" prop="userRole" required>
        <el-select v-model="updateForm.userRole">
          <el-option
            v-for="item in roleList"
            :key="item.roleType"
            :label="item.roleName"
            :value="item.roleType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="updateForm.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="updateForm.email" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="updateDetail()"
          id="submit"
        >
          提交
        </el-button>
        <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { getUserInfoApi, updateUserDetailApi } from "@/api/user";
import { getRolesListApi } from "@/api/role";
import { emailReg } from "@/utils/regexp.js";
import TopBar from "@/components/common/TopBar.vue";
import { useTokenStore } from "@/stores/useTokenStore";

const router = useRouter();
const route = useRoute();
const { token } = useTokenStore();
// 控制该表单内组件的尺寸
const formSize = ref("default");

// 接收通过路由跳转传过来的用户ID
const userId = route.query.userId;
// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 存放角色列表
const roleList = ref([]);
// 收集表单内容
const updateForm = reactive({
  username: "",
  id: "",
  email: "",
  avatar: "",
  userRole: 0,
});

onMounted(() => {
  getUserInfo();
  getRolesList();
});

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  try {
    const res = await getUserInfoApi(userId);
    const { username, id, email, avatar, role } = res.data;

    // 回显
    updateForm.username = username;
    updateForm.id = id;
    updateForm.email = email;
    updateForm.userRole = role.roleType;
    updateForm.avatar = avatar;
  } catch (error) {
    ElMessage.error(error);
  }
};

/**
 *  获取角色列表
 */
const getRolesList = async () => {
  try {
    var res = await getRolesListApi();
    roleList.value = res.data.slice(1);
    console.log(roleList.value);
  } catch (error) {
    ElMessage.error(error);
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
      const res = await updateUserDetailApi(updateForm);
      ElMessage.success(res.msg);

      // 跳转回用户列表页
      router.push({ name: "user" });
    } else {
      // 【问题】后端在这里的验证无效
      ElMessage.error("表单数据不符合规则！")
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
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
    { min: 2, max: 12, message: "用户名长度为2~12个字符", trigger: "blur" },
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
.formContainer {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    padding: 20px 50px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;

    .el-form-item {
      width: 60%;
    }
  }
  .avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    /* display: block; */
  }

  #submit {
    position: absolute;
    right: -250px;
  }

  #reset {
    position: absolute;
    right: -160px;
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
