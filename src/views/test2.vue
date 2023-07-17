<template>
  <div class="container">
    <ul class="menu">
      <li v-for="item in arrey" :key="item.key" :class="{ active: item.key == current }" @click="liClick(item.key)">
        {{ item.title }}
      </li>
    </ul>
    <div class="content">
      <div :id="item.key" v-for="item in arrey" :key="item.key">
        {{ item.title }}
      </div>
      <!-- <div id="key1">国家1</div>
      <div id="key2">省份2</div>
      <div id="key3">城市3</div>
      <div id="key4">县城4</div>
      <div id="key5">国家5</div>
      <div id="key6">省份6</div>
      <div id="key7">城市7</div>
      <div id="key8">县城8</div>
      <div id="key9">县城9</div>
      <div id="key10">县城10</div> -->
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watchEffect, computed } from "vue";
import { useStore } from 'vuex';
const store = useStore()
const arrey = reactive(computed(() => store.state.webArry))
// 默认高亮的标题
const current = ref("key1");
const flag = ref(false);//----放开是另一种效果
const liClick = (key) => {
  flag.value = true;//----放开是另一种效果
  current.value = key;

  /* 
  获取到key 然后渠道对应的元素 进行滚动
   */
  let content = document.querySelector(".content");
  let target = document.querySelector(`#${key}`);
  content.scrollTo({
    top: target.offsetTop - 60,
    behavior: "smooth",
  });
};
const list = reactive([
  {
    key: "key1",
    name: "国家1",
  },
  {
    key: "key2",
    name: "省份2",
  },
  {
    key: "key3",
    name: "城市3",
  },
  {
    key: "key4",
    name: "县城4",
  },
  {
    key: "key5",
    name: "国家5",
  },
  {
    key: "key6",
    name: "省份6",
  },
  {
    key: "key7",
    name: "城市7",
  },
  {
    key: "key8",
    name: "县城8",
  },
  {
    key: "key9",
    name: "县城9",
  },
  {
    key: "key10",
    name: "县城10",
  },
]);
const showKeys = reactive([
  // "ke1",
  // "key2",
  // "key3",
  // "key4",
  // "key5",
  // "key6",
  // "key7",
  // "key8",
  // "key9",
  // "key10",
]);
// -----交叉观察器
let io = new IntersectionObserver(
  (entrys) => {
    // console.log("进入视口--", entrys[0].target.id);
    // 获取视图第一个元素id
    let firstInsetId = entrys[0].target.id;
    // 检查第一个元素是否可见
    let isInter = entrys[0].isIntersecting;
    // console.log(11111, isInter);

    if (isInter) {
      // 如果可见，
      // 
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
  },
  { threshold: [0, 0.25, 0.5, 1] }
);
watchEffect(() => {
  if (flag.value) return;//----放开是另一种效果
  let result = "";

  for (const item of arrey.value) {
    if (showKeys.findIndex((key) => key === item.key) !== -1) {
      result = item.key;
      break;
    }
  }
  current.value = result;
});
console.log(watchEffect);
// ----初始化监听
const startObser = () => {

  for (const item of arrey.value) {
    // 找到数组对象中 所有key的dom 并把他放在 showKeys 中
    let el = document.querySelector(`#${item.key}`);
    showKeys.push(item.key);
    // 对找到的dom元素进行监听
    io.observe(el);
  }
};

onMounted(() => {
  let content = document.querySelector(".content");//----放开是另一种效果
  content.addEventListener("mouseenter", () => {//----放开是另一种效果
    console.log(123);
    flag.value = false;
  });
  startObser();
});
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #fff;
  display: flex;
  justify-content: flex-start;

  .menu {
    margin-right: 5px;
    width: 120px;
    border: 1px solid pink;
    padding: 0;
    margin-bottom: 0;

    li {
      list-style: none;
      height: 26px;
      line-height: 26px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: rgb(211, 14, 100);
      }
    }

    li.active {
      background-color: rgb(211, 14, 100);
    }
  }

  .content {
    width: calc(100% - 120px);
    border: 1px solid red;
    overflow-y: auto;
    padding-top: 5px;

    div {
      height: 500px;
      border: 1px solid rgb(0, 255, 21);
      // margin-bottom: 3px;
    }
  }
}
</style>