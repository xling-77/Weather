<template>
  <div id="personWrap" class="flex" :style="imgback" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中......">
    <button id="changeBack" @click="changeBack($event)" v-useDrag>
      <i class="el-icon-refresh"></i>
    </button>
    <button @click="changeRoute" id="changeRoute">切换至专业版</button>
    <div id="picTip" v-show="loadpic">
      <div v-if="!getpic">图片加载中......请稍后</div>
      <div v-if="getpic">图片加载完成，正在为您切换</div>
    </div>
    <div id="currentWea" class="flex blurWrap">
      <p>
        <i class="el-icon-location"></i>{{ curRes.area }}
      </p>
      <p>
        <button @click="showSelector = !showSelector">[切换城市]</button>
        <citySelect @change="updatedArea" innertext="" v-show="showSelector" class="cityPosition"></citySelect>
      </p>
      <p><span>{{ parseInt(curRes.real) }}</span>℃</p>
      <p>{{ curRes.lowest }} ~ {{ curRes.highest }}</p>
      <p>{{ curRes.weather }} &nbsp;空气{{ airRank(curRes.aqi) }}</p>
      <p>{{ curRes.wind }} {{ curRes.windsc }}</p>
      <p>
        <span>
          <el-popover
            placement="top"
            title="tips:"
            width="300"
            trigger="click"
            :content="curRes.tips">
            <el-button slot="reference">今日小贴士</el-button>
          </el-popover>
        </span>
      </p>
      <p v-if="hasalarm">
        <span v-for="(alarm, index) in curRes.alarmlist" :key="index">
          <el-popover
            placement="top"
            title="预警详情:"
            width="300"
            trigger="click"
            :content="alarm.content">
            <el-button slot="reference"><i class="el-icon-bell"></i>{{ alarm.level }}{{ alarm.type }}预警</el-button>
          </el-popover>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../../utils/index'
import citySelect from '../public/citySelect.vue'
import pic from '../../assets/json/picture.json'

export default {
  components: {citySelect},
  data () {
    return {
      // 全屏遮罩提示
      fullscreenLoading: false,
      // 图片加载提示
      loadpic: false,
      getpic: true,
      // 城市选择器开关
      showSelector: false,
      // 壁纸切换计数
      iter: 0,
      imgback: {backgroundImage: "url('https://www.dpm.org.cn/Uploads/Picture/2022/05/31/s62956bf17e916.jpg')"},
      // 地区id
      areaid: '',
      // 实时天气数据
      curRes: {
        'date': '2020-05-23',
        'week': '星期二',
        'province': '上海市',
        'area': '上海市',
        'areaid': '101020100',
        'weather': '晴转多云',
        'weatherimg': 'duoyun.png',
        'weathercode': 'qing_duoyun',
        'real': '20℃',
        'lowest': '6℃',
        'highest': '22℃',
        'wind': '东北风',
        'windspeed': '7',
        'windsc': '1-2级',
        'sunrise': '06:10',
        'sunset': '22:31',
        'moonrise': '06:02',
        'moondown': '22:22',
        'pcpn': '0.0',
        'uv_index': '0',
        'aqi': '34',
        'quality': '优',
        'vis': '25',
        'humidity': '23',
        'alarmlist': [
          {
            'province': '上海市',
            'city': '上海市',
            'level': '黄色',
            'type': '大雾',
            'content': '上海中心气象台2020年05月23日20时30分发布大雾黄色预警信号：预计今天下半夜到明天早晨本市大部郊区将出现能见度小于500米的雾，局部地区小于200米，请注意防范。',
            'time': '2020-05-23 20:30:00'
          }
        ],
        'tips': '天气暖和，适宜着单层棉麻面料的短套装、T恤衫、薄牛仔衫裤、休闲服、职业套装等春秋过渡装。年老体弱者请适当增减衣服。空气质量优秀，快去户外呼吸清新空气吧。'
      }
    }
  },
  computed: {
    hasalarm () {
      if (this.curRes.alarmlist !== undefined && this.curRes.alarmlist.length !== 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    // 监听地区id变化，如有变即刻请求新数据
    areaid: {
      handler (cur) {
        if (cur) {
          this.fullscreenLoading = true
          this.getData(cur)
          setTimeout(() => {
            this.showSelector = false
          }, 2000)
        }
      },
      immediate: true
    },
    // 监听响应数据
    curRes: {
      handler () {},
      immediate: true,
      deep: true
    },
    // 修复壁纸切换闪屏——监听背景图片源
    imgback: {
      handler (cur) {
        let imgall = cur.backgroundImage
        let imgallArr = imgall.split(',')
        let result = ''
        // 冗余数据处理：超出总壁纸数（5）时就只保留一个。
        if (imgallArr.length > 5) {
          imgallArr.splice(1, 5)
          result = imgallArr.join(',')
          this.imgback.backgroundImage = result
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getData (params) {
      api.getTWea1(params).then((res) => {
        this.curRes = res.data.result
        this.fullscreenLoading = false
      })
        .catch(() => {
          alert('数据接口故障，数据暂不更新，可联系平台管理员，即刻为您修复。')
        })
    },
    // 壁纸切换：按钮变色、背景图片更换
    changeBack (event) {
      this.loadpic = true
      this.getpic = false
      if (parseInt(this.iter) > 4) {
        this.iter = 0
        event.target.style.backgroundImage = `none`
      } else {
        this.iter += 1
        event.target.style.backgroundImage = `radial-gradient(circle at 50% 0,transparent ${100 - this.iter * 20}%,#ef5e1f ${this.iter * 20}%)`
      }
      // 修复壁纸切换时的白色闪屏：预加载图片，确认加载完毕再更换壁纸
      let imgload = new Promise((resolve, reject) => {
        const img = new Image()
        img.src = pic[this.iter]
        // 加载图片，加载完成后resolve
        img.onload = resolve(img.src)
        img.onerror = reject
      })
      imgload.then((params) => {
        this.getpic = true
        this.imgback.backgroundImage = `url('${params}'),` + this.imgback.backgroundImage
        this.loadpic = false
      })
        .catch(() => {
          this.loadpic = false
          alert('图片加载失败，请稍后重试')
        })
    },
    // 接收城市选择器传过来的地区id
    updatedArea (e) {
      this.areaid = e
      localStorage.setItem('historyAreaid', e)
    },
    // 实时空气质量等级输出:AQI数值→等级
    airRank (params) {
      if (parseInt(params) < 51) {
        return '优'
      } else if (parseInt(params) < 101) {
        return '良'
      } else if (parseInt(params) < 151) {
        return '轻度污染'
      } else if (parseInt(params) < 201) {
        return '中度污染'
      } else if (parseInt(params) < 301) {
        return '重度污染'
      } else {
        return '严重污染'
      }
    },
    changeRoute () {
      setTimeout(() => {
        let result = confirm('为获取最佳效果，推荐您用电脑访问。请问您确定切换页面吗？')
        if (result) {
          this.$router.push({name: 'work', params: {city: localStorage.getItem('historyAreaid')}})
        }
      }, 100)
    }
  },
  created () {
    this.getData(localStorage.getItem('historyAreaid'))
  },
  mounted () {
    alert('欢迎访问生活小助手！\n点击右下角气泡，您可以切换壁纸；同时，气泡可以被拖拽至屏幕内的任何地方。\n您的好运正在派送，请保持心情舒畅^-^')
  }
}
</script>

<style lang="scss">
$fontColor:#fff;
#personWrap{
  @media screen and (max-width : 900px) {
    font-size: 16px;
  }
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  font-size: 24px;
  font-weight: 600;
  color: $fontColor;
  background: no-repeat center/cover fixed;
  background-image: url('https://www.dpm.org.cn/Uploads/Picture/2022/05/31/s62956bf17e916.jpg');
  background-color: #c06c84;
  transition: background-image 1.5s linear;
  // 切换壁纸按钮
  #changeBack{
    position: fixed;
    left:80%;
    top:80%;
    z-index: 99;
    width: 50px;
    height: 50px;
    border:1px solid transparent;
    border-radius: 50%;
    background: none;
    box-shadow:inset 0 0 10px 0 rgb(202, 200, 200);
    transition: background-image,box-shadow 1s ease-in;
    i{
      font-size: 2em;
      color:#fff;
    }
    // 悬停按钮时：按钮文字切换、按钮背景色改变
    &:hover{
      background-image: radial-gradient(rgb(15, 15, 15) 1%,transparent);
      i{
        display: none;
      }
      &::before{
        content:'切换壁纸';
        width: 60px;
        height: 60px;
        color:#fff;
      }
    }
    // 点击按钮时：按钮文字切换、有光圈
    &:active{
      background-image: radial-gradient(#ebebeb 10%,transparent);
      &::before{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        content:'';
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 5px solid #ebebeb;
        animation: halo 1s infinite alternate linear;
        @keyframes halo {
          50%{
            width: 60px;
            height: 60px;
          }
          100%{
            width: 65px;
            height: 65px;
            border-width: 2px;
          }
        }
      }
    }
  }
  .flex{
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;
  }
  // 模糊遮罩的样式
  .blurWrap{
    margin:15vh auto;
    width: calc(100% - 5px);
    height: 70%;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  // 实时天气部分
  #currentWea{
    padding: 10px 0;
    text-align: center;
    // 固定城市选择器
    position: relative;
    p{
      margin: 10px;
      // 城市
      &:first-child{
        margin-bottom: 0;
        font-size: 1.5em;
        font-family: cursive;
      }
      // 城市选择器
      &:nth-child(2){
        margin: 0 auto;
        button{
          border: none;
          background: none;
          color:inherit;
          font-size: 0.5em;
          font-weight: bold;
          &:hover{
            color:#114193;
          }
        }
        .cityPosition{
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          height: 15rem;
          background: linear-gradient(45deg,#355c7d,#6c5b7b,#c06c84);
        }
      }
      // 实时气温格式
      &:nth-child(3) span{
        font-size: 3.5em;
      }
    }
  }
  // 切换路由按钮
  #changeRoute{
    position: fixed;
    bottom: 10px;
    background: rgba($fontColor, 0.8);
    border:none;
    outline: none;
    opacity:0.8;
  }
}
</style>
