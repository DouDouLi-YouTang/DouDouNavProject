<template>
  <el-container class="common-layout" ref="divDom">
    <el-aside>
      <el-scrollbar>
        <div class="website-left" v-if="arrey.length">
          <div class="website-left-box" v-for="(item, index) in arrey" :key="index">
            <div :class="{ active: item.key == current }" @click="liClick(item.key)"
              :style="{ paddingRight: editMode ? '20px' : '0' }">
              {{ item.title }}
              <div class="website-left-box-edit" v-if="editMode">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-icon class="on-inline">
                      <More />
                    </el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="sortModify('edit', item)">
                        <el-icon>
                          <Edit />
                        </el-icon>编辑</el-dropdown-item>
                      <el-dropdown-item @click="sortTableOpen('sort', item)">
                        <el-icon style="transform: rotate(90deg);">
                          <Switch />
                        </el-icon>排序
                      </el-dropdown-item>
                      <el-dropdown-item style="color: #F56C6C;" @click="sortDel(item)">
                        <el-icon>
                          <Delete />
                        </el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <!-- <el-icon>
                  <EditPen />
                </el-icon> -->
              </div>
            </div>
          </div>
          <transition name="bounce">
            <div class="website-left-box" @click="sortModify('add')" v-show="editMode">
              <p class="website-left-add">
                <el-icon>
                  <Plus />
                </el-icon>
              </p>
            </div>
          </transition>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <el-scrollbar ref="scrollbarRef">
        <div style="height: 40px;"></div>
        <div class="website-right-box">
          <div class="website-right-title" v-for="(item, index) in arrey" :key="index" :id="item.key">
            <div class="website-right-title-box">
              <h2>{{ item.title }}</h2>
            </div>
            <div class="box">
              <div class="webBox" v-for="(res, index) in item.childers" :key="index">
                <template v-if="res.jianjie">
                  <div class="jianjie">{{ res.jianjie }} </div>
                </template>
                <a :href="res.url" target="_blank">
                  <div class="webUrl">
                    <img :src="res.imgUrl ? res.imgUrl : 'https://img.bidianer.com/image/icon/empty.svg'">
                    <div>{{ res.webName }}</div>
                  </div>
                </a>
                <div class="bianji" v-if="isShowEdit">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-icon class="on-inline">
                        <More />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="edit(item, res, index)">
                          <el-icon>
                            <Edit />
                          </el-icon>编辑
                        </el-dropdown-item>
                        <el-dropdown-item @click="sortTableOpen('web', item)">
                          <el-icon style="transform: rotate(90deg);">
                            <Switch />
                          </el-icon>排序
                        </el-dropdown-item>
                        <el-dropdown-item style="color: #F56C6C;" @click="del(item, res, index)">
                          <el-icon>
                            <Delete />
                          </el-icon>删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
              <transition name="bounce">
                <div class="webBox" v-show="editMode">
                  <div class="jianjie">点击新增</div>
                  <p @click="add(item)">
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
  <div class="editMode" v-if="isShowEdit" @click="editMode = !editMode">
    <el-tooltip class="box-item" effect="dark" content="编辑模式" placement="top">
      <el-icon>
        <Edit />
      </el-icon>
    </el-tooltip>
  </div>
  <!-- 网页收藏新增 -->
  <el-dialog v-model="dialogVisible" :title="dialogType == 'edit' ? '修改' : '新增'" width="500" class="tanceng"
    style="border-radius: 5px;" @close="closeDialog">
    <div class="box" v-bind="dailogData">
      <div class="webBox">
        <template v-if="dailogData.jianjie">
          <div class="jianjie">{{ dailogData.jianjie }}</div>
        </template>
        <a>
          <div class="webUrl">
            <img id="dailogImg"
              :src="dailogData.imgUrl ? dailogData.imgUrl : 'https://img.bidianer.com/image/icon/empty.svg'">
            <div>{{ dailogData.title }}</div>
          </div>
        </a>
      </div>
    </div>
    <el-divider style="margin-top:10px;" />
    <el-form label-width="100px" :rules="rules" ref="ruleFormRef" :model="dailogData" style="max-width: 460px">
      <el-form-item label="分类">
        <el-select :disabled="dialogType == 'edit'" v-model="dailogData.sort" placeholder="请选择一个分类">
          <el-option v-for="(item, index) in dailogData.selectData" :key="index" :label="item.title"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="网站名称" prop="title">
        <el-input v-model="dailogData.title"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="dailogData.jianjie" />
      </el-form-item>
      <el-form-item label="网页地址" prop="url">
        <el-input v-model="dailogData.url">
          <template #append>
            <el-button type="primary" @click="getImgUrl">获取网页图标</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="网页图标地址" prop="imgUrl">
        <el-input clearable v-model="dailogData.imgUrl" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm" :disabled="editButton">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 排序 -->
  <el-dialog v-model="tableSortDialog" title="排序(拖动)" width="300" class="sortDialogs" @opened="rowDrop">
    <el-table id="table" :data="sortList.list" row-key="id" style="width: 300px" border height="300"
      show-overflow-tooltip>
      <el-table-column label="排序" width="60" align="center">
        <template #default="scope">
          <span class="iconfont handle">&#xe616;</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
    </el-table>
  </el-dialog>
  <!-- 分类新增 -->
  <el-dialog class="sortDialog" v-model="sortDiaog" :title="sortTitle.type == 'edit' ? '修改分类名称' : '新增分类'" width="500"
    @close="closeSortDialog">
    <el-form :model="sortTitle" ref="sortFormRule" :rules="sortRule" label-width="120px">
      <el-form-item label="分类名称" prop="title">
        <el-input clearable v-model="sortTitle.title" placeholder="请输入分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="sortDiaog = false">取消</el-button>
        <el-button type="primary" @click="sortDiaogconfirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 更新日志弹窗 -->
  <el-dialog v-model="upDataLog" title="近期更新" class="upDataLogDiaLog" width="500" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <div class="log">
      <el-scrollbar>
        <div class="log-box" v-for="(item, index) in logData " :key="index">
          <template v-if="index == 0">
            <ul>
              <li v-for="(log, index) in item.logs" :key="index">
                <span v-html="log"></span>
              </li>
            </ul>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <span>
        <el-button type="warning" @click="upDataLog = false">我知道啦</el-button>
        <el-button type="primary" @click="gotothelogpage">
          查看更多更新日志
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>

import { ref, onMounted, computed, reactive, nextTick, watchEffect, toRef, toRefs, watch, onUnmounted } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import IndexDB from '../untils/indexDB.js'
import Sortable from 'sortablejs'
import uplog from '../untils/upDataLog.js'
const store = useStore()
const router = useRouter();
store.dispatch('createData');
//#region 日志弹窗
const logData = uplog.logData
const upDataLog = ref(false)
const thisTime = 1689506611037
let oldTime = JSON.parse(localStorage.getItem('oldTime'))
onMounted(() => {
  if (!oldTime || thisTime > oldTime) {
    upDataLog.value = true
    oldTime = new Date().getTime();
    localStorage.setItem('oldTime', JSON.stringify(oldTime))
  }
})
function gotothelogpage() {
  router.push('./updatalog')
  localStorage.setItem('menuid', JSON.stringify('updatalog'))
}
//#endregion

// 网页渲染的数据
const arrey = computed(() => store.state.webArry)

// 当分类只剩一项并且没有子集是会触发
watchEffect(() => {
  if (arrey.value.length == 1 && arrey.value[0].childers.length == 0) {
    ElNotification({
      title: '提示',
      message: `<span style="color:#F56C6C;">检测到当前分类子项为空，如需添加请点击右下方编辑按钮新增</span>`,
      dangerouslyUseHTMLString: true,
      duration: 0,
    })
  }
})

const callbackMessage = computed(() => store.getters.getmessage);
// 获取dom宽度
const divDom = ref(null);

// 弹框显示/隐藏
const dialogVisible = ref(false)

// 弹窗显示类型
const dialogType = ref('')

// 弹窗确定按钮禁用
const editButton = ref(false)

// 编辑模式打开/关闭
const editMode = ref(false);

// 是否显示修改按钮
const isShowEdit = ref(false);

// dom宽度
const windowWidth = ref(window.innerWidth)

// 排序弹窗显示/隐藏
const tableSortDialog = ref(false);

// 分类新增弹窗/隐藏
const sortDiaog = ref(false);

//#region 实时监控窗口宽度
watchEffect(() => {
  if (windowWidth.value < 500) {
    isShowEdit.value = false
  } else {
    isShowEdit.value = true
  }
})

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth
});
//#endregion

//#region 编辑弹窗
const dailogData = reactive({
  // sort: '', // 分类
  // title: '', // 网站名称
  // url: '', // 网页地址
  // imgUrl: '',// 图片地址
  // jianjie: '' // 简介
})

// 监听arrey的值，如果发生改变这重置下拉框内的数据
watchEffect(() => {
  dailogData.selectData = arrey.value.map(item => { // 下拉框数据
    return {
      'title': item.title,
      'value': item.key
    }
  })
})

// 表单验证
const ruleFormRef = ref(null);

// 网址验证
const urlpass = (rule, value, callback) => {
  const pass = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
  if (value === '') {
    callback()
  } else if (!pass.test(value)) {
    callback(new Error("请输入正确的网址"))
  } else {
    callback()
  }
}

const rules = reactive({
  title: { required: true, message: '请输入网站名称', trigger: 'blur' },
  url: [
    { required: true, message: '请输入网页地址', trigger: 'blur' },
    { validator: urlpass, trigger: 'blur' }
  ],
  imgUrl: [
    { validator: urlpass, trigger: 'blur' }],
});

// 修改时弹窗的数据
const edit = function (item, childer, index) {
  // 打开弹窗
  dialogVisible.value = true;
  dialogType.value = 'edit';
  dailogData.metaDataId = childer.metaDataId
  dailogData.sort = item.key;
  dailogData.title = childer.webName
  dailogData.url = childer.url
  dailogData.jianjie = childer.jianjie
  dailogData.imgUrl = childer.imgUrl
}

// 新增时弹窗的数据
const add = function (item) {
  dialogVisible.value = true;
  dialogType.value = 'add';
  dailogData.sort = item.key;
  dailogData.metaDataId = new Date().getTime();
  dailogData.imgUrl = ''
}

// 当弹窗关闭时
function closeDialog() {
  // 清空所有数据
  Object.keys(dailogData).forEach(key => {
    if (key != 'selectData') {
      delete dailogData[key]
    }
  });
  const imgElement = document.getElementById('dailogImg');
  imgElement.onload = null;
  imgElement.onerror = null;
}
// 确定
const confirm = function () {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value == 'edit') {
        store.commit('editData', dailogData)
      } else {
        store.commit('addData', dailogData)
      }
      ElMessage({
        message: callbackMessage.value.message,
        type: callbackMessage.value.type,
      })
      if (callbackMessage.value.type == 'success') {
        dialogVisible.value = false;
        saveData()
      }
    } else {
      console.log("验证失败");
    }
  });
}
// 删除
const del = function (item, childer, index) {
  ElMessageBox.confirm(
    `你确定要删除 <span style="color:#ec4141">${item.title}</span> 分类下的 <span style="color:#ec4141">${childer.webName}</span> 吗?`,
    '警告',
    {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      confirmButtonClass: 'deleteButton',
    }).then(() => {
      const data = {
        key: item.key,
        metaDataId: childer.metaDataId
      }
      store.commit('delData', data)
      ElMessage({
        message: callbackMessage.value.message,
        type: callbackMessage.value.type,
      })
      if (callbackMessage.value.type == 'success') {
        saveData()
      }
    }).catch(() => {

    })
}
// 获取网页图标
function getImgUrl() {
  const pass = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
  if (pass.test(dailogData.url)) {
    const url = new URL(dailogData.url)
    if (dailogData.imgUrl != url.origin + '/favicon.ico' && editButton.value == false) {
      editButton.value = true
    }
    dailogData.imgUrl = url.origin + '/favicon.ico'
    const imgElement = document.getElementById('dailogImg');
    imgElement.onload = function () {
      if (dailogData.imgUrl != '') {
        ElNotification({
          title: '成功',
          message: '图标获取成功!',
          type: 'success',
        })
      }
      editButton.value = false
    };
    imgElement.onerror = function () {
      ElNotification({
        title: '错误',
        message: '图标获取失败!',
        type: 'error',
      })
      dailogData.imgUrl = ''
      editButton.value = false
    };
  } else {
    ElMessage({
      message: '请输入正确的网址',
      type: 'error',
    })
  }
}
// 保存
async function saveData() {
  // 数据库名称 表名称
  const dbName = 'DouDouDB', storeName = 'website';
  const db = await IndexDB.openDB(dbName, storeName, 1);
  const newData = { id: 1, data: JSON.stringify(arrey.value) };
  IndexDB.updateDB(db, storeName, newData);
}
//#endregion

//#region 分类编辑
const sortTitle = reactive({})
const sortFormRule = ref(null)
const sortRule = reactive({
  title: { required: true, message: '请输入标题名称', trigger: 'blur' },
})

// 点击新增或修改时
function sortModify(type, item) {
  sortTitle.type = type;
  if (sortTitle.type == 'add') {
    sortTitle.key = new Date().getTime()
  } else {
    sortTitle.key = item.key
    sortTitle.title = item.title
  }
  sortDiaog.value = true;
}
function sortDel(item) {
  ElMessageBox.confirm(
    `你确定要删除 <span style="color:#ec4141">${item.title}</span> 这个分类吗?  </br>
    警告：该操作会删除 <span style="color:#ec4141">${item.title}</span> 分类下的所有内容！
    `,
    '警告',
    {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      confirmButtonClass: 'deleteButton',
    }).then(() => {
      const key = item.key
      store.commit('sortDel', key)
      ElMessage({
        message: callbackMessage.value.message,
        type: callbackMessage.value.type,
      })
      if (callbackMessage.value.type == 'success') {
        saveData()
      }
    }).catch(() => {

    })
}
// 点击确定
function sortDiaogconfirm() {
  sortFormRule.value.validate((valid) => {
    if (valid) {
      if (sortTitle.type == 'edit') {
        store.commit('editSort', sortTitle)
      } else {
        store.commit('addSort', sortTitle)
      }
      ElMessage({
        message: callbackMessage.value.message,
        type: callbackMessage.value.type,
      })
      if (callbackMessage.value.type == 'success') {
        sortDiaog.value = false;
        saveData()
      }
    }
  })
}

// 当弹窗关闭时
function closeSortDialog() {
  Object.keys(sortTitle).forEach(key => delete sortTitle[key]);
}

//#endregion

//#region 排序
let sortList = {
  list: [],
  sortKey: '',
  type: ""
}

function sortTableOpen(type, item) {
  sortList.type = type
  sortList.sortKey = item.key
  if (type == 'web') {
    sortList.list = item.childers.map(item => ({ 'name': item.webName, 'id': item.metaDataId }))
  } else {
    sortList.list = arrey.value.map(item => ({ 'name': item.title, 'id': item.key }))
  }
  tableSortDialog.value = true
}
// Sortable 实例
let sortableInstance
// 表格行拖拽
const rowDrop = () => {
  // 如果Sortable 实例存在则不再创建
  if (!sortableInstance) {
    let tbody = document.querySelector(".el-table__body-wrapper tbody");
    sortableInstance = Sortable.create(tbody, {
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
      },
      onUpdate(evt) {
        // 拖拽更新节点位置发生该事件
      },
      onRemove(evt) {
        // 删除拖拽节点的时候促发该事件
      },
      onStart: function (evt) {
        // 开始拖拽出发该函数
      },
      onSort(evt) {
        // 发生排序发生该事件
      },
      onEnd(evt) {
        // 结束拖拽
        // 如果拖拽结束后顺序发生了变化，则对数据进行修改
        if (evt.oldIndex !== evt.newIndex) {
          let sortKeyIndex, currRow
          let currentIndex = arrey.value.findIndex(item => item.key == current.value)
          if (sortList.type == 'web') {
            sortKeyIndex = arrey.value.findIndex(item => item.key == sortList.sortKey)
            if (sortKeyIndex != -1) {
              currRow = arrey.value[sortKeyIndex].childers.splice(evt.oldIndex, 1)[0];
              arrey.value[sortKeyIndex].childers.splice(evt.newIndex, 0, currRow);
              ElMessage({
                message: '排序保存成功!',
                type: 'success',
              })
              saveData()
            } else {
              ElMessage({
                message: '获取分类名称索引值失败!',
                type: 'error',
              })
            }
          } else {
            currRow = arrey.value.splice(evt.oldIndex, 1)[0];
            arrey.value.splice(evt.newIndex, 0, currRow);
            // 设置默认选中
            current.value = arrey.value[currentIndex].key
            ElMessage({
              message: '排序保存成功!',
              type: 'success',
            })
            saveData()
          }
        }
      },
    });
  }
};
//#endregion

//#region  滚动效果
// 滚动条
const scrollbarRef = ref(null);
// 默认选择一个 空则默认第一个
const current = ref(null);
const flag = ref(false);
const liClick = (key) => {
  flag.value = true;
  current.value = key;
  /* 
  获取到key 然后渠道对应的元素 进行滚动
   */
  // 获取父级容器
  // let content = document.querySelector(".website-right-box");
  let target = document.querySelector(`#${key}`);
  // document.getElementById(key).scrollIntoView({ behavior: 'smooth', inline: 'start' });
  scrollbarRef.value.scrollTo({
    top: target.offsetTop - 40,
    behavior: "smooth",
  })

  // content.scrollTo({
  //   // 距离顶部导航栏的距离
  //   top: target.offsetTop - 60,
  //   behavior: "smooth",
  // });
};
// 所有dom元素的id
const showKeys = reactive([]);
// -----交叉观察器
let io = new IntersectionObserver((entrys) => {
  let firstInsetId = entrys[0].target.id;
  let isInter = entrys[0].isIntersecting;
  if (isInter) {
    let isFind = showKeys.findIndex((item) => item == firstInsetId);
    if (isFind == -1) {
      showKeys.push(firstInsetId);
    }
  } else {
    let index = showKeys.findIndex((item) => item == firstInsetId);
    if (index !== -1) {
      showKeys.splice(index, 1);
    }
  }
  if (flag.value) return; //----放开是另一种效果
  let result = "";
  for (const item of arrey.value) {
    if (showKeys.findIndex((key) => key === item.key) !== -1) {
      result = item.key;
      break;
    }
  }
  current.value = result;
}, {
  threshold: [0, 0.25, 0.5, 1]
}
);
const startObser = () => {
  for (const item of arrey.value) {
    let el = document.querySelector(`#${item.key}`);
    showKeys.push(item.key);
    io.observe(el);
  }
};
onMounted(() => {
  let content = document.querySelector(".website-right-box");
  content.addEventListener("mousewheel", () => {
    flag.value = false;
  });

  setTimeout(() => {
    // 如果当前网址是 #/homeson/website
    if (window.location.hash == '#/homeson/website') {
      startObser();
    }
  }, 500)
});

onUnmounted(() => {
  io.disconnect()
})
//#endregion

</script>
<style lang="less" scoped>
.common-layout {
  height: calc(100vh - 60px);
  margin: 0 auto;
  max-width: 1400px;

  .el-aside {
    // max-width: 200px !important;
    margin-top: 40px;
    margin-bottom: 40px;
    border-radius: 10px;
    overflow: hidden;
    transition: all .5s;

    .website-left {
      padding: 10px;
      padding-left: 20px;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;

      .website-left-box {
        position: relative;

        p {
          cursor: pointer;
          height: 40px;
          border-radius: 5px;
          transition: all .5s;
          font-size: 14px;
          border: 1.5px dashed rgba(236, 245, 255, );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        p:hover {
          background-color: #ecf5ff;
          color: #409eff;

        }

        >div {
          transition: all .5s;
          font-size: 14px;
          line-height: 40px;
          cursor: pointer;
          border-radius: 5px;
          margin: 5px 0;
          overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
          white-space: nowrap; //（设置文字在一行显示，不能换行）
          text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）

          .website-left-box-edit {
            display: inline-block;
            width: auto;
            position: absolute;
            right: 10px;
            cursor: pointer;
            transition: all .5s;
            opacity: 0;
            bottom: 0px;
            line-height: initial;
            background-color: initial;
            font-size: 15px;
            margin: 0;
          }

          .website-left-box-edit:hover {
            padding: 0;
            background-color: initial;

            .el-dropdown-link {
              color: #0072ea;
            }
          }
        }

        >div:hover {
          color: #409eff;
          background-color: #ecf5ff;
          padding-left: 20px;

          .website-left-box-edit {
            opacity: 1;
          }
        }

        div:first-child.active {
          color: #409eff;
          background-color: #ecf5ff;
          padding-left: 20px;
        }
      }

    }


  }

  .el-main {
    margin: 0 auto;
    padding: 0;
    max-width: 1400px;
    height: 100%;
    transition: all .5s;

    .website-right-box {
      padding: 0 10px 0 20px;
      height: 100%;

      .website-right-title {
        padding-top: 15px;

        .website-right-title-box {
          display: inline-block;
          border-radius: 10px;
          // padding: 12px;
          transition: all .3s;
          cursor: pointer;

          h2 {
            user-select: none;
            color: #606266;
            font-weight: 400;
            font-size: 20px;
            transition: all .3s;
            display: flex;
            align-items: center;
            position: relative;
            margin-bottom: 5px;

            // transform: translateX(-10px);
            h2 .el-icon {
              font-size: 12px;
              margin-left: 5px;
            }
          }

          h2::after {
            content: '';
            height: 2px;
            width: 0px;
            background-color: #0072ea;
            position: absolute;
            bottom: -2px;
            transition: all .5s;
          }

        }

        .website-right-title-box:hover {
          // background-color: #e7f1fd;

          h2 {
            color: #0072ea;
            // transform: translateX(0);
          }

          h2::after {
            width: calc(100% + 10px);

          }
        }

        .el-divider {
          margin-top: 10px;
          margin-bottom: 0;
        }

        .box {
          display: flex;
          padding: 5px 0;
          flex-wrap: wrap;
          position: relative;

          .webBox {
            cursor: pointer;
            position: relative;
            display: flex;
            justify-content: space-around;
            background-color: #ffffff;
            transition: all 0.5s;
            margin: 5px 5px;
            border-radius: 5px;

            a {
              width: 100%;
              padding: 10px;
            }

            p {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all .5s;
              font-size: 22px;
              height: 42px;
            }

            .jianjie {
              position: absolute;
              display: flex;
              z-index: 9999;
              opacity: 0;
              font-size: 16px;
              border: 1px solid;
              // display: inline-block;
              transition: transform 0.5s, opacity 0.5s;
              background-color: #515051;
              color: white;
              padding: 8px 10px;
              border-radius: 8px;
              text-align: center;
              bottom: 50px;
              // transform: translateY(-25px);
              left: -5000px;
            }

            .jianjie::after {
              content: "";
              position: absolute;
              bottom: -16px;
              right: 50%;
              transform: translateX(50%);
              border: 8px solid #515051;
              border-bottom-color: transparent;
              border-left-color: transparent;
              border-right-color: transparent;
            }

            .webUrl {
              display: flex;
              align-items: flex-end;
              width: 98%;

              position: relative;

              div {
                width: 100%;
                overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
                white-space: nowrap; //（设置文字在一行显示，不能换行）
                text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
                height: 100%;
                line-height: 22px;
                font-size: 15px;
              }

              img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
            }

            .bianji {
              visibility: hidden;
              position: absolute;
              right: 8px;
              font-size: 20px;
              bottom: -3px;
              color: #a1a1a1;
            }

            .bianji:hover {

              .on-inline {
                color: #409eff;
              }
            }
          }

          .webBox:hover {
            box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
            transform: translate3d(0, -2px, 0);

            p {
              color: #0072ea;
            }

            .webUrl {
              div {
                width: 85%;
              }
            }

            .jianjie {
              display: block;
              opacity: 1;
              transform: translateY(-10px);
              left: initial;
            }

            .bianji {
              visibility: visible;
            }

          }
        }

      }
    }



  }


}

.tanceng {
  .box {
    display: flex;
    // padding: 10px 0;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;

    .webBox {
      cursor: pointer;
      position: relative;
      display: flex;
      justify-content: space-around;
      padding: 10px 10px;
      background-color: #ffffff;
      transition: all 0.5s;
      margin: 5px 5px;
      border-radius: 5px;
      box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
      transform: translate3d(0, -2px, 0);

      a {
        width: 100%;
      }

      .jianjie {
        position: absolute;
        display: flex;
        z-index: 9999;
        display: block;
        border: 1px solid;
        // display: inline-block;
        transition: transform 0.5s, opacity 0.5s;
        background-color: #515051;
        color: white;
        padding: 8px 10px;
        border-radius: 8px;
        text-align: center;
        bottom: 50px;
        // transform: translateY(-25px);
      }

      .jianjie::after {
        content: "";
        position: absolute;
        bottom: -16px;
        right: 50%;
        transform: translateX(50%);
        border: 8px solid #515051;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
      }

      .webUrl {
        display: flex;
        align-items: flex-end;
        width: 98%;
        position: relative;

        div {
          width: 100%;
          overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
          white-space: nowrap; //（设置文字在一行显示，不能换行）
          text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
          line-height: 24px;
        }

        img {
          width: 22px;
          height: 22px;
          margin-right: 5px;
        }
      }
    }

    .webBox:hover {
      .jianjie {
        display: block;
        opacity: 1;
        transform: translateY(-10px);
        left: initial;
      }
    }
  }
}

.editMode {
  position: absolute;
  right: 100px;
  bottom: 100px;
  background-color: white;
  padding: 15px;
  font-size: 25px;
  border-radius: 50%;
  line-height: 100%;
  cursor: pointer;
  transition: all .5s;
  user-select: none;
  z-index: 10;
}

.editMode:hover {
  background-color: #ecf5ff;
  color: #0072ea;
}

// 组件过渡动画
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.sortDialogs {
  .handle {
    transition: all .5s;
    cursor: pointer;
    font-size: 18px;
    vertical-align: text-bottom;
  }

  .handle:hover {
    color: #0072ea;
  }
}

.upDataLogDiaLog {
  .log {
    background-color: white;
    border-radius: 10px;
    margin: 0 20px;

    .el-divider {
      margin-top: 10px;
    }

    ul {
      padding-left: 20px;
      line-height: 30px;
      font-size: 16px;
    }
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

/*当页面最大宽小于1920 */
@media screen and (max-width: 1920px) {
  .webBox {
    width: 268px;
  }

  .el-aside {
    width: 200px;
  }
}

/*当页面最大宽小于400*/
@media only screen and (max-width: 450px) {
  .webBox {
    width: 200px;
  }

  .el-aside {
    width: 140px;
  }
}
</style>
