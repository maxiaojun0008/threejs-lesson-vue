<script setup lang="ts">

</script>

<template>
  <div class="top-header">
    <div class="btn">三维机房</div>
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<style  lang="scss">
body{
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app{
  width: 100%;
  height: 100vh;
}
.top-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2c3e50;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  padding: 0 50px;
  .btn{
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    background: #fff;
    border-radius: 5px;
    color: #2c3e50;
    cursor: pointer;
  }
}
.content{
  width: 100%;
  height:calc(100% - 50px)
}

</style>
