import { createStore } from 'vuex'
import IndexDB from '../untils/indexDB.js'
import webData from '../untils/websiteData.js'
export default createStore({
  state: {
    webArry: [],
    message: '暂无内容',
    type: 'success'
  },
  getters: {
    getmessage(state) {
      return {
        message: state.message,
        type: state.type
      }
    }
  },
  mutations: {
    setData(state, data) {
      state.webArry = data
    },
    addData(state, data) {
      const titleIndex = state.webArry.findIndex(item => item.key == data.sort)
      if (titleIndex != -1) {
        const newData = {
          imgUrl: data.imgUrl,
          jianjie: data.jianjie,
          metaDataId: data.metaDataId,
          webName: data.title,
          url: data.url
        }
        state.webArry[titleIndex].childers.push(newData)
        state.message = '新增成功！'
        state.type = 'success'
      } else {
        state.message = '分类名称索引值失败！'
        state.type = 'error'
      }
    },
    // 修改内容
    editData(state, data) {
      const titleIndex = state.webArry.findIndex(item => item.key == data.sort)
      const childerIndex = state.webArry[titleIndex].childers.findIndex(item => item.metaDataId == data.metaDataId)
      let webData = state.webArry[titleIndex].childers[childerIndex]
      if (titleIndex != -1 && childerIndex != -1) {
        webData.imgUrl = data.imgUrl
        webData.jianjie = data.jianjie
        webData.url = data.url
        webData.webName = data.title
        state.message = '修改成功！'
        state.type = 'success'
      } else if (titleIndex == -1) {
        state.message = '获取分类名称索引值失败！'
        state.type = 'error'
      } else {
        state.message = '网站标题索引值失败！'
        state.type = 'error'
      }
    },
    //删除内容
    delData(state, data) {
      const titleIndex = state.webArry.findIndex(item => item.key == data.key)
      const childerIndex = state.webArry[titleIndex].childers.findIndex(item => item.metaDataId == data.metaDataId)
      if (titleIndex != -1 && childerIndex != -1) {
        state.message = '删除成功！'
        state.type = 'success'
        state.webArry[titleIndex].childers.splice(childerIndex, 1)
      } else if (titleIndex == -1) {
        state.message = '获取分类名称索引值失败！'
        state.type = 'error'
      } else {
        state.message = '网站标题索引值失败！'
        state.type = 'error'
      }
    },
    addSort(state, data) {
      const newData = {
        title: data.title,
        key: 'id-' + data.key,
        childers: []
      }
      state.webArry.push(newData)
      state.message = '分类新增成功！'
      state.type = 'success'
    },
    editSort(state, data) {
      const titleIndex = state.webArry.findIndex(item => item.key == data.key)
      if (titleIndex != -1) {
        state.webArry[titleIndex].title = data.title
        state.message = '分类名称修改成功！'
        state.type = 'success'
      } else {
        state.message = '获取分类名称索引值失败！'
        state.type = 'error'
      }
    },
    sortDel(state, data) {
      const titleIndex = state.webArry.findIndex(item => item.key == data)
      if (titleIndex != -1 && state.webArry.length > 1) {
        state.webArry.splice(titleIndex, 1)
        state.message = '分类删除成功！'
        state.type = 'success'
      } else if (titleIndex == -1) {
        state.message = '获取分类名称索引值失败！'
        state.type = 'error'
      } else {
        state.message = '请至少保留一个分类！'
        state.type = 'warning'
      }
    },
  },
  actions: {
    // 初始化数据
    async createData(state) {
      if (!state.state.webArry.length) {
        // 数据库名称 表名称
        const dbName = 'DouDouDB', storeName = 'website';
        // 打开数据库 1为版本号
        const db = await IndexDB.openDB(dbName, storeName, 1);
        const webDatas = await IndexDB.getDataByKey(db, storeName, 1);
        // 如果数据库中有值
        if (webDatas) {
          const data = JSON.parse(webDatas.data);
          state.commit('setData', data);
        } else {
          const arreyValue = JSON.parse(JSON.stringify(webData.webArry));
          state.commit('setData', arreyValue);
          // const newData = { id: 1, data: JSON.stringify(arreyValue) };
          // await IndexDB.addData(db, storeName, newData);
          // IndexDB.deleteDBAll(dbName)
        }
      }
    },
  },
  modules: {

  }
})
