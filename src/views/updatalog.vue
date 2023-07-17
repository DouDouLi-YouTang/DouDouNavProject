<template>
  <div id="Log">
    <div class="log">
      <el-scrollbar>
        <div class="log-main">
          <h1>更新日志 :</h1>
          <div class="log-box" v-for="(item, index) in logData " :key="index">
            <h2>{{ item.time }}</h2>
            <el-divider />
            <ul>
              <li v-for="(log, index) in item.logs" :key="index">
                <span v-html="log"></span>
              </li>
              <li v-if="index == 0">
                如果需要重置所有数据请 <span id="reset" style="color:#409eff;  cursor: pointer;">点击此处</span>
              </li>
            </ul>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { inject, provide, ref, onMounted, computed, reactive, nextTick, watchEffect } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from 'vuex';
import IndexDB from '../untils/indexDB.js'
import webData from '../untils/websiteData.js'
import uplog from '../untils/upDataLog.js'
const store = useStore()
const logData = uplog.logData
nextTick(() => {
  const reset = document.getElementById("reset")
  reset.onclick = () => {
    ElMessageBox.confirm(
      `<p>你确定要重置全部数据吗?
        </br><span style="color:red">注意！此操作会删除所有本地数据！</span>
      </p>`,
      '警告',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
      }).then(async () => {
        const arreyValue = JSON.parse(JSON.stringify(webData.webArry));
        store.commit('setData', arreyValue)
        const dbName = 'DouDouDB', storeName = 'website';
        // const db = await IndexDB.openDB(dbName, storeName, 1);
        // const newData = { id: 1, data: JSON.stringify(webData.webArry) };
        // IndexDB.updateDB(db, storeName, newData);、
        IndexDB.deleteDBAll(dbName)
        ElMessage({
          message: '数据重置成功',
          type: 'success',
        })
      }).catch(() => {

      })
  }
})
</script>

<style lang="less" scoped>
#Log {
  height: calc(100vh - 100px);
  margin: 0 auto;
  max-width: 1400px;


  .log-main {
    padding: 40px;
  }

  .log {
    margin: 40px;
    background-color: white;
    border-radius: 10px;
    height: calc(100% - 40px);

    .log-box {
      margin-bottom: 40px;
    }

    h1 {
      margin-top: 0;
      margin-bottom: 40px;
    }

    h2 {
      margin-bottom: 10px;
    }

    .el-divider {
      margin-top: 10px;
    }

    ul {
      padding-left: 20px;
      line-height: 30px;
    }
  }
}
</style>