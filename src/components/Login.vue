<template>
  <div class="login">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">

      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="on"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="on"></el-input>
      </el-form-item>

      <div class="box clearfix">
        <span class="lf" @click="clearCookie"
              style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">忘记密码？</span>
        <div class="rt">
          <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%;">登录</el-button>
        <!--  <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>


</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
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
            //判断复选框是否被勾选 勾选则调用配置cookie方法
            if (self.checked == true) {
              //传入账号名，密码，和保存天数3个参数
              self.setCookie(self.ruleForm.username, self.ruleForm.password, 7);
            } else {
              console.log("清空Cookie");
              //清空Cookie
              self.clearCookie();
            }
            const userName = self.ruleForm.username;
            const password = self.ruleForm.password;
            debugger;
            $.ajax({
              url : 'http://localhost:8081/login/login',
              type : 'post',
              data : {
                userName : userName,
                password : password
              },

              success : function(data) {
                debugger;
                var result = data.result;
                if(result == 'true' || result == true){
                  alert("登录成功");
                }else {
                  alert("登录失败");
                }
              },
              error : function(data) {
                alert(data);
              },
              dataType : 'json',
            });
            alert('登录成功!');
            if (self.ruleForm.username == 'superadmin' && self.ruleForm.password == '123456') {
              sessionStorage.setItem('user', self.ruleForm.username);
              this.$router.push({path: '/'});
            } else {
              this.$alert('username or password wrong!', 'info', {
                confirmButtonText: 'ok'
              })
            }
            this.$router.push({
              name: 'Home',
              params: {userName: self.ruleForm.username, password: self.ruleForm.password}
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
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
              this.ruleForm.username = arr2[1]; //保存到保存数据的地方
            } else if (arr2[0] == 'password') {
              // console.log(arr2[1])
              this.ruleForm.password = arr2[1];
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
</style>
