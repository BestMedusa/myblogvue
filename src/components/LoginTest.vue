<template>
  <div class="img1">
    <div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left"
               label-width="60px" class="login-container">
        <h3 class="login_title">系统登录</h3>

        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="on"></el-input>
        </el-form-item>

        <div class="box clearfix">
<!--        <span class="lf" @click="" style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">忘记密码？</span>-->
          <div class="rt">
<!--            <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>-->
<!--            <span class="to-register" @click="register" style="cursor: pointer;color: #1980ff;">立即注册</span>-->
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" style="width:100%;">登录</el-button>
        </el-form-item>
        <div>
          <p class="register">
            <span class="gray-text" style="font-size: 13px;color: #999999;" > 没有账号？ </span><span class="to-register" @click="register">免费注册</span>
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginForm: {
          username: 'superadmin',
          password: '123456'
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
          ]
        },
        checked: false

      };
    },
    //页面加载调用获取cookie值
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const self = this;
            self.loading = true;
            var param = {
              userName: self.loginForm.username,
              password: self.loginForm.password
            };
            this.$http.post('/api/login/login', param).then((response) => {
              console.log(response.data);
              if (response.status == 200 && response.data.code == 2000) {
                this.$store.dispatch('setUser', response.data.data.userName);
                this.$router.push({path: 'home', query: {user: response.data.data}});
                localStorage.setItem("token", response.data.ticket)
              } else {
                self.$alert('用户名或密码错误!', '登录失败!');
              }
              self.loading = false;
            }, (response) => {
              self.loading = false;
              self.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      register: function () {
        this.$router.push({path: 'register'});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .register{
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
  .lf {
    float: left;
  }

  .box {
    min-width: 350px;
    margin-left: 50px;
    width: 30%;
  }

  .to-register {
    cursor:pointer;
    font-size: 13px;
    color: #1980ff;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }

  .clearfix {
    *zoom: 1;
  }

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }

  .img1 {
    background: url("../assets/small.jpg");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
    top: 0px;
    left: 0px
  }
</style>
