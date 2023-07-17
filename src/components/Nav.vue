<template>
  <el-menu :router="true" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    @select="handleSelect">
    <el-menu-item index="/">兜兜里丿有糖</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="website">实用网站导航</el-menu-item>
    <el-menu-item index="updatalog">更新日志</el-menu-item>
    <!-- <el-menu-item index="test">测试</el-menu-item> -->
    <!-- <el-sub-menu index="2">
      <template #title>教程</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
  </el-menu>
</template>

<script>
import { useRouter } from 'vue-router'
import { inject, onMounted, ref, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Nav',
  setup() {
    const router = useRouter()
    const store = useStore()
    const activeIndex = ref('website')
    router.beforeEach(to => {
      const menuIndex = to.name;
      if (menuIndex != 'home') {
        localStorage.setItem('menuid', JSON.stringify(menuIndex))
        activeIndex.value = menuIndex
      } else {
        localStorage.setItem('menuid', JSON.stringify('website'))
      }
    })

    // const res = computed(() => {
    //   return store.state.menuIndex
    // })

    onMounted(() => {
      activeIndex.value = JSON.parse(localStorage.getItem('menuid'))
    })

    const handleSelect = (key, keyPath) => {
      // // 将菜单下标保存到本地
      localStorage.setItem('menuid', JSON.stringify(key))
    }

    return {
      activeIndex,
      handleSelect,
      router
    }
  }
}
</script>
<style scoped>
.el-menu-demo {
  padding: 0 calc((100% - 1400px)/2);
}

.flex-grow {
  flex-grow: 1;
}
</style>
