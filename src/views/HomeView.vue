<template>
  <div id="Home">
    <div class="home-box">
      <div class="home-title">
        <h1>兜兜里有糖</h1>
        <span>&nbsp;{{ title }}<b v-show="!show">&nbsp;</b><b v-show="show">|</b></span>
      </div>
      <div class="home-button">
        <button @click="jump">进入</button>
      </div>
      <div class="home-icon">
        <div class="QQ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-QQ"></use>
          </svg>
        </div>
        <div class="weixin">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-weixin"></use>
          </svg>
        </div>
        <div class="github">
          <a href="https://github.com/DouDouLi-YouTang" target="_blank">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-github"></use>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const titleData = [
      '你总觉得别人不达标，是因为心里曾有个得过满分的。',
      '这世界最好的事莫过于，你喜欢的人刚好也喜欢你。',
      '我带着真诚与善良而来，该遗憾的不应该是我。',
      '你联系我，我就听你说，你不联系我，我就顺其自然。',
      '我连1/4的选择题都做不对，怎么有把握选对1/14亿的人。',
      '所有的离开都是蓄谋已久，无一例外',
      '我见过很多人性和黑暗，但我依然单纯对你。我的意思是，你的那些伎俩，不该用在我身上',
      '月亮虽然遥远，但某一刻真的照亮过我',
    ]
    // 定时器的启动与停止
    const timeStatr = ref(0)
    // 文字索引值
    const titleIndex = ref(0)
    // 数组索引值
    const index = Math.floor(Math.random() * titleData.length)
    const titleArryIndex = ref(index)
    // 显示的文字
    const title = ref('')
    // 文字定时器
    const time = setInterval(() => {
      if (timeStatr.value == 0) {
        if (titleArryIndex.value != titleData.length) {
          if (titleIndex.value != titleData[titleArryIndex.value].length) {
            title.value += titleData[titleArryIndex.value][titleIndex.value]
            titleIndex.value += 1
          } else {
            titleArryIndex.value += 1
            titleIndex.value = 0
            timeStatr.value = 1
            // clearInterval(time)
            setTimeout(() => {
              title.value = ''
              timeStatr.value = 0
            }, 10000)
          }
        } else {
          titleArryIndex.value = 0
        }
      }
    }, 100);
    // 文字后面的的 | 定时器
    const show = ref(true)
    const time2 = setInterval(() => {
      show.value = !show.value
    }, 500)

    // 在跳转页面后清除定时器
    onUnmounted(() => {
      // console.log('111')
      clearInterval(time)
      clearInterval(time2)
    });
    const router = useRouter()
    const jump = () => {
      let result = '/homeson'
      router.push(result)
      localStorage.setItem('menuid', JSON.stringify('website'))
    }
    return {
      jump,
      title,
      show,
    }
  }
}
</script>

<style scoped>
#Home {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: black;
}

#Home::after {
  width: inherit;
  height: inherit;
  content: "";
  position: absolute;
  z-index: 0;
  /* filter: blur(1px); */
  left: 0;
  top: 0;
  opacity: 0.5;
  background-image: url('@/assets/img/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.home-box {
  position: absolute;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 35%;
  transform: translate(0, -35%);
  text-align: center;
}

.home-box .home-title {
  color: white;
}

.home-box .home-title b {
  display: inline-block;
  width: 5.7px;
}


.home-box .home-button {
  margin-top: 50px;
}

.home-box .home-button button {

  line-height: 30px;
  user-select: none;
  background-color: transparent;
  color: white;
  border: none;
  border: 1px solid white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.5s;
  overflow: hidden;
}

.home-box .home-button button:hover {
  background-color: #409eff;
}

.home-box .home-icon {
  padding-top: 50px;
  display: flex;
}

.home-box .home-icon>div {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.home-box .home-icon a {
  display: inline-block;
  cursor: pointer;
}

.home-box .home-icon .QQ::after,
.home-box .home-icon .weixin::after {
  content: "";
  width: 0px;
  height: 0px;
  border-radius: 10px;
  position: absolute;
  overflow: hidden;
  bottom: 35px;
  left: 50%;
  opacity: 0;
  transform: translate(-50%);
  transition: all .5s;
  background-position: center center;
  background-size: cover;
}

.home-box .home-icon .QQ::after {
  background-image: url(../assets/img/QQ.png);
}

.home-box .home-icon .weixin::after {
  background-image: url(../assets/img/weixin.png);
}

.home-box .home-icon .QQ:hover::after,
.home-box .home-icon .weixin:hover::after {
  width: 150px;
  height: 150px;
  opacity: 1;
}

.home-box .home-icon .icon {
  width: 25px;
  height: 25px;
  margin: 0 10px;
}

/*当页面最大宽小于1920 */
@media screen and (max-width: 1920px) {

  .home-box .home-title h1 {
    font-size: 60px;
  }

  .home-box .home-title span {
    line-height: 40px;
    font-size: 16px;
  }

  .home-box .home-button button {
    font-size: 16px;
    width: 200px;
  }
}

/*当页面最大宽小于400*/
@media only screen and (max-width: 450px) {
  .home-box .home-title h1 {
    font-size: 40px;
  }

  .home-box .home-title span {
    line-height: 30px;
    font-size: 14px;
  }

  .home-box .home-button button {
    font-size: 14px;
    width: 140px;
  }
}
</style>
