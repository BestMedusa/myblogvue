<template>
  <el-row type="flex" justify="center">
    <el-form ref="registerForm" :model="user" :rules="rules" status-icon label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="user.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" type="phone"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="authCode">
        <el-input v-model="user.authCode" type="authCode"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="user.gender" type="gender"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="login">注册</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  export default {
    methods: {
      login() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            if (this.user.name === 'admin' && this.user.pass === '123') {
              this.$notify({
                type: 'success',
                message: '欢迎你,' + this.user.name + '!',
                duration: 3000
              })
              this.$router.replace('/')
            } else {
              this.$message({
                type: 'error',
                message: '用户名或密码错误',
                showClose: true
              })
            }
            this.$router.replace('/')
          } else {
            return false
          }
        })
      }
    },
    data() {
      return {
        user: {},
        rules: {
          name: [{required: true, message: '用户名不能为空', trigger: 'blur'},{min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}],
          phone: [{required: true, message: '手机号不能为空', trigger: 'blur'},{validator:validatePhone, trigger:'blur'}],
          pass: [{required: true, message: '密码不能为空', trigger: 'blur'},{min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}],
          gender: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          authCode: [{required: true, message: '验证码不能为空', trigger: 'blur'}]
        }
      }
    }
  }
</script>

<style scoped>

</style>
