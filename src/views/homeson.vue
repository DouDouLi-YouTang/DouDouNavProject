<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Nav />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Nav from '../components/Nav.vue';


export default {
  name: 'About',
  components: {
    Nav
  },
  setup() {

  }
}
</script>
<style scoped>
.common-layout {
  background-color: #f5f5f5;
  max-width: 100%;
}

.el-header {
  padding: 0;
}

.el-main {
  padding: 0;
  /* height: calc(100vh- 60px); */
  background-color: #f5f5f5;
}
</style>