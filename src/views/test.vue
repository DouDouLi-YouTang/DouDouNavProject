<template>
  <el-button @click="btn">点击显示</el-button>
  <el-dialog ref="dialog" v-model="tableSortdialog" title="排序" @opened="rowDrop">
    <el-table id="table" :data="list" row-key="id" style="width: 500px">
      <el-table-column label="排序" width="60" align="center">
        <template #default="scope">
          <el-icon class="handle" style="cursor:move;">
            <Expand />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="昵称" width="180" />
    </el-table>
  </el-dialog>
</template>
<script setup>
import Sortable from 'sortablejs'
import { ref, onMounted, computed, reactive, nextTick, watchEffect, toRef, toRefs, onUpdated } from 'vue';
const tableSortdialog = ref(false)
const dialog = ref(null)
const list = reactive([
  { name: '12', id: '1' },
  { name: '13', id: '2' },
  { name: '14', id: '3' },
])
const btn = () => {
  tableSortdialog.value = true
}

// 表格行拖拽
const rowDrop = () => {
  let tbody = document.querySelector(".el-table__body-wrapper tbody");
  Sortable.create(tbody, {
    // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    group: {
      name: "words",
      pull: true,
      put: true,
    },
    handle: '.handle',
    animation: 150, // ms, number 单位：ms，定义排序动画的时间
    onAdd(evt) {
      // 拖拽时候添加有新的节点的时候发生该事件
      console.log("onAdd.foo:", [evt.item, evt.from]);
    },
    onUpdate(evt) {
      // 拖拽更新节点位置发生该事件
      console.log("onUpdate.foo:", [evt.item, evt.from]);
    },
    onRemove(evt) {
      // 删除拖拽节点的时候促发该事件
      console.log("onRemove.foo:", [evt.item, evt.from]);
    },
    onStart: function (evt) {
      // 开始拖拽出发该函数
      console.log(evt.item);
      console.log(evt.from);
      // console.log("onStart.foo:", [evt.item, evt.from]);
    },
    onSort(evt) {
      // 发生排序发生该事件
      console.log("onUpdate.foo:", [evt.item, evt.from]);
    },
    onEnd(evt) {
      // 结束拖拽
      console.log("结束表格拖拽", evt);
      // 如果拖拽结束后顺序发生了变化，则对数据进行修改
      // if (evt.oldIndex !== evt.newIndex) {
      //   let currRow = fieldOptions.value.splice(evt.oldIndex, 1)[0];
      //   fieldOptions.value.splice(evt.newIndex, 0, currRow);
      //   // 将排序后的ID抽离成数组传给后端
      //   let optIDs = [];
      //   fieldOptions.value.forEach((item) => {
      //     optIDs.push(item.ID);
      //   });
      //   const params = {
      //     Params: {
      //       SpaceID: spaceID.value,
      //       LaunchID: launchID.value,
      //       OptIDs: optIDs,
      //     },
      //     Options: {
      //       APIServer: apiServer,
      //     },
      //   };
      //   // 发送改变顺序的请求
      //   // store.commit("doRequest");
      //   spaceService.OrderOptions(params).then((res) => {
      //     store.commit("deResponse");
      //     if (res.Status === 0) {
      //       console.log("表格顺序修改成功");
      //     } else {
      //       ElMessage({
      //         showClose: true,
      //         message: res.ErrorMessage,
      //         type: "error",
      //         duration: 10000,
      //       });
      //     }
      //   });
      // }
    },
  });
};


</script>
<style lang="less" scoped></style>