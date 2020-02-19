<template>
    <div class="login">
        <div class="login_box">
            <!--  头像区域  -->
            <div class="avatar_box">
                <img src="~assets/logo.png" alt="logo">
            </div>
            <!--  登陆表单区域  -->
            <el-form ref="loginFormRef" class="login_form" :rules="loginFormRules" :model="loginForm" label-width="0px">
                <!--  用户名  -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--  密码  -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!--  按钮  -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登录表单数据的绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置
    reset () {
      // resetFields是element-ui,from表单元素里自带的方法,用于重置表单
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录
    login () {
      // validate表单预验证方法
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http({
          url: 'login',
          method: 'post',
          data: this.loginForm
        })
        if (result.meta.status !== 200) return this.$message.error('您输入的用户名或密码不正确')
        this.$message.success('登录成功')
        // 将服务端返回的token值存储到本地sessionStorage中
        window.sessionStorage.setItem('token', result.data.token)
        // 登录成功后跳转到后台管理首页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
