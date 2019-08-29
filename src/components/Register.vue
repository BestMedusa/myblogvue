<template>
  <el-row type="flex" justify="center">
    <el-form ref="registerForm" :model="user" :rules="rules" status-icon label-width="80px" class="register-container">
      <h3 class="register_title">用户注册</h3>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="authCode" class="form-authCode">
        <el-input v-model="user.authCode" placeholder="请输入验证码" class="input_code"></el-input>
        <div class="my-code-get" @click="sendAuthCode(user.phone)" id="new_yan">
          <span v-show="show" style="cursor: pointer;">发送验证码</span>
          <span v-show="!show">{{count}}s</span>
        </div>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="user.gender" :label="1" :value="1">男</el-radio>
        <el-radio v-model="user.gender" :label="0" :value="0">女</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="login">注册</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import {validatePhone} from "../utils/validate";

  export default {
    methods: {
      sendAuthCode(phone) {
        let _this = this;
        _this.loading = false;
        debugger;
        let param = {
          phone: phone,
          type: "1"
        };
        if (this.timer == null) {
          this.$http.post('/api/register/getAuthCode', param).then((res) => {
            console.log(res.data);
            if (res.status == 200 && res.data.code == 2000) {
              _this.$alert('发送成功', '发送成功!');
            } else {
              _this.$alert(res.data.message, '发送失败!');
            }
            _this.loading = false;
          }, () => {
            _this.loading = false;
            _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
          });
        }
        if (!this.timer) {
          this.count = 60;
          this.show = false;
          // $(".my-code-get").addClass("huise");
          // 将鼠标设置为不可点击状态
          document.getElementById('new_yan').style.cursor = 'not-allowed'
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= 60) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      },
      login() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            const _this = this;
            _this.loading = true;
            const param = {
              userName: _this.user.name,
              password: _this.user.password,
              phone: _this.user.phone,
              authCode: _this.user.authCode,
              gender: _this.user.gender,
            };
            debugger
            this.$http.post('/api/register/register', param).then((res) => {
              console.log(res.data);
              if (res.status == 200 && res.data.code == 2000) {
                _this.loading = false;
                this.$router.push({path: '/', query: {user: res.data}});
              } else {
                _this.$alert(res.data.message, '注册失败!');
              }
              _this.loading = false;
            }, (response) => {
              _this.loading = false;
              _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
            });
            this.$router.replace('/')
          } else {
            return false
          }
        })
      }
    },
    data() {
      return {
        show: true,
        count: 60,
        timer: null,
        user: {
          name: '',
          password: '',
          phone: '',
          authCode: '',
          gender: 1,
        },
        rules: {
          name: [{required: true, message: '用户名不能为空', trigger: 'blur'}, {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }],
          phone: [{required: true, message: '手机号不能为空', trigger: 'blur'}, {validator: validatePhone, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}, {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }],
          authCode: [{required: true, message: '验证码不能为空', trigger: 'blur'}]
        }
      }
    }
  }
</script>

<style scoped>
  .input_code {
    width: 180px;
    float: left;
    font-size: 15px;
    border: none;
    margin-right: 20px;
    flex: 1;
    text-align: right;
    color: #999999;
  }

  .btn_send_code {
    font-size: 14px;
    line-height: 20px;
  }

  .register-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .register_title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
</style>
