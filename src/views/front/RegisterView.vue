<template>
  <!-- 粒子库 -->
  <Particles
    id="tsparticles"
    :particlesInit="particlesInit"
    :particlesLoaded="particlesLoaded"
    :options="config"
  />
  <p class="title">注 册</p>
  <div class="formContainer">
    <h3>Welcome to Register</h3>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="ruleForm"
      label-position="top"
      :size="formSize"
      status-icon
      style="font-weight: bold"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" :prefix-icon="User" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          :prefix-icon="Lock"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
          v-model="ruleForm.rePassword"
          :prefix-icon="Lock"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="用户类型" prop="roleName">
        <el-radio-group v-model="ruleForm.roleName">
          <el-radio label="普通用户" />
        </el-radio-group>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="registerUser(ruleFormRef)"
          id="submit"
        >
          注册
        </el-button>
        <el-button @click="resetForm(ruleFormRef)" id="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { loadFull } from "tsparticles";
import { config } from "@/utils/register_config";
import { postUserRegisterApi } from "@/api/user.js";

// 粒子配置
const particlesInit = async (engine) => {
  await loadFull(engine);
};
const particlesLoaded = async (container) => {
  // console.log("Particles container loaded...", container);
};

const router = useRouter();

// ref 获取整个DOM表单对象
const ruleFormRef = ref();
// 收集表单内容
const ruleForm = reactive({
  username: "",
  password: "",
  rePassword: "",
  roleName: "普通用户",
});
// 角色映射
const roleMapping = {
  普通用户: 303,
};

// 控制该表单内组件的尺寸
const formSize = ref("default");

// 校验二次输入密码
const checkRePwd = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the correct  password again"));
  } else if (value !== ruleForm.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = reactive({
  username: [
    {
      required: true,
      message: "Please input the correct username",
      trigger: "blur",
    },
    { min: 2, max: 12, message: "Length should be 2 to 12", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "Please input the correct  password",
      trigger: "blur",
    },
    { min: 6, max: 12, message: "Length should be 6 to 12", trigger: "blur" },
  ],
  rePassword: [
    {
      required: true,
      validator: checkRePwd,
      trigger: "blur",
    },
    { min: 6, max: 12, message: "Length should be 6 to 12", trigger: "blur" },
  ],
  roleName: [
    {
      required: true,
      message: "Please select your roleName",
      trigger: "change",
    },
  ],
});

// 注册按钮
const registerUser = (ruleFormRef) => {
  if (!ruleFormRef) return;

  ruleFormRef.validate(async (valid, fields) => {
    if (valid) {
      // 进行角色身份映射处理，因为传给后端的需要是角色id
      const userRole = roleMapping[ruleForm.roleName];

      // 将角色名称替换为角色ID
      const formData = {
        username: ruleForm.username,
        password: ruleForm.password,
        userRole: userRole,
      };

      // 将json格式的数据转换为x-www-form-urlencoded格式的数据
      const params = new URLSearchParams();
      for (let key in formData) {
        params.append(key, formData[key]);
      }

      // console.log(params);

      const res = await postUserRegisterApi(params);

      console.log(res);
      if(res.code === 200){
        ElMessage.success(res.msg);
        router.push("/login");
      }
    } else {
      // 表单验证失败的逻辑处理
      console.error("error submit!", fields);
    }
  });
};

// 重置按钮
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return;
  // resetFields：重置该表单项，将其值重置为初始值，并移除校验结果
  ruleFormRef.resetFields();
};
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  font-size: 50px;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  position: fixed;
  top: 30px;
  left: 50px;
  word-spacing: 10px;
}
.formContainer {
  font-family: "Courier New", Courier, monospace;
  box-sizing: border-box;
  width: 300px;
  background-color: rgba($color: #fff, $alpha: 0.8);
  border-radius: 5px;
  position: fixed;
  top: 15%;
  right: calc(50% - 150px);
  padding: 18px;
  text-align: center;
  h3 {
    margin: 10px 0 20px 0;
    color: #575454;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  #submit {
    width: 75%;
    font-family: "Courier New", Courier, monospace;
  }
  #reset {
    width: 20%;
    font-family: "Courier New", Courier, monospace;
  }
  .el-link {
    margin-right: 8px;
    color: #0000ff;
  }
}
</style>
