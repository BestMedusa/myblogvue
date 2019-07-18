<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left"
           label-width="60px" class="login-container" v-loading="loading">
    <h3 class="login_title">系统登录</h3>

    <el-form-item label="账号" prop="username">
      <el-input v-model="loginForm.username" autocomplete="on"></el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="loginForm.password" autocomplete="on"></el-input>
    </el-form-item>

    <div class="box clearfix">
        <span class="lf" @click="clearCookie"
              style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">忘记密码？</span>
      <div class="rt">
        <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
      </div>
    </div>

    <el-form-item>
      <el-button type="primary" @click="submitForm('loginForm')" style="width:100%;">登录</el-button>
<!--        <el-button @click="resetForm('loginForm')">重置</el-button>-->
    </el-form-item>
  </el-form>

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
            {required: true, message: '请输入账号', trigger: 'blur'},
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
      this.getCookie();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const self = this;
            debugger
            //判断复选框是否被勾选 勾选则调用配置cookie方法
            if (self.checked == true) {
              //传入账号名，密码，和保存天数3个参数
              self.setCookie(self.loginForm.username, self.loginForm.password, 7);
            } else {
              console.log("清空Cookie");
              //清空Cookie
              self.clearCookie();
            }
            const userName = self.loginForm.username;
            const password = self.loginForm.password;
            // debugger;
            var param = {userName: userName, password: password};
            //json传参 后端@requestBody对象
            // this.$http.post('/api/login/login', JSON.stringify(param),{
            //   headers: {
            //     'Content-Type':'application/json;charset=UTF-8'
            //   }
            // }).then((response) => {
            this.$http.post('/login/login', param).then((response) => {
              debugger;
              console.log(response.data);
              if (response.data.code == 2000) {
                sessionStorage.setItem('user', self.loginForm.username);
                // self.$router.replace({path: '/home'});
                this.$router.push({
                  name: 'Home',
                  params: {userName: self.loginForm.username, password: self.loginForm.password}
                });
              } else {
                self.$alert('登录失败!', '用户名或密码错误!');
              }
            }, (response) => {
              // console.log("error");
              // error callback
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //设置cookie
      setCookie(c_name, c_pwd, exdays) {
        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie
        window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      //读取cookie
      getCookie: function () {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('='); //再次切割
            //判断查找相对应的值
            if (arr2[0] == 'userName') {
              //  console.log(arr2[1])
              this.loginForm.username = arr2[1]; //保存到保存数据的地方
            } else if (arr2[0] == 'password') {
              // console.log(arr2[1])
              this.loginForm.password = arr2[1];
            }
          }
          this.checked = true;
        }
      },
      //清除cookie
      clearCookie: function () {
        this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    min-width: 350px;
    width: 25%;
    margin: auto;
  }

  .lf {
    float: left;
  }

  .box {
    min-width: 350px;
    margin-left: 50px;
    width: 30%;
  }

  .rf {
    float: right;
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

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
