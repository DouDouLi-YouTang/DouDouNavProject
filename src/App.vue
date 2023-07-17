<template>
  <router-view />
</template>
<script setup>


import { useStore } from 'vuex';
const store = useStore()
// 初始化数据

</script >
<style lang="less">
.sortDialogs {
  .el-dialog__body {
    padding: 5px;
  }

}
</style>
