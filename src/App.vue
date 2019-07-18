<template>
  <div class="img1">
    <el-container>
<!--      <el-header class="header" height="10px">-->
<!--        <h3>Vue学习</h3>-->
<!--        <p>用户登录</p>-->
<!--      </el-header>-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  .img1{
    background: url("./assets/back.jpg");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%
  }
  /*.header {*/
  /*  background-color: #409EFF;*/
  /*  color: white;*/
  /*}*/
</style>


<!--<template>-->
<!--  <div id="app">-->
<!--    <img src="./assets/logo.png">-->
<!--    <router-view/>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'App'-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--#app {-->
<!--  font-family: 'Avenir', Helvetica, Arial, sans-serif;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--  text-align: center;-->
<!--  color: #2c3e50;-->
<!--  margin-top: 60px;-->
<!--}-->
<!--</style>-->
