<template>
  <div id="work">
    <titleBorder></titleBorder>
    <div id="urban">
      <div>
        <p> {{ curWea.area }} </p>
        <p>
          <button @click="showSelector = !showSelector"> 切换城市 </button>
          <citySelector @change="updatedArea" innertext="" v-if="showSelector" class="cityPosition"></citySelector>
        </p>
        <p>{{ curWea.province }}</p>
      </div>
      <div>
        <p>今日天气</p>
        <p><i class="iconfont" :class="weatherIcon"></i></p>
        <p>{{ curWea.weather }}</p>
      </div>
      <div>
        <p>今日气温</p>
        <p>{{ removeUnit(curWea.real) }}<sup>&#x2103;</sup></p>
        <p id="temRank">{{ removeUnit(curWea.lowest) }} ~ <span>{{ removeUnit(curWea.highest) }}</span> &#x2103;</p>
      </div>
      <div>
        <p>空气质量</p>
        <p><i class="el-icon-stopwatch"></i></p>
        <p>{{ airRank(curWea.quality) }}</p>
      </div>
      <div>
        <p>能见度</p>
        <p><i class="el-icon-view"></i></p>
        <p>{{curWea.vis}} km</p>
      </div>
      <div>
        <p>紫外线</p>
        <p><i class="el-icon-umbrella"></i></p>
        <p>{{ uvRank(curWea.uv_index) }}</p>
      </div>
      <div>
        <p>风向</p>
        <p>{{ curWea.wind }}</p>
        <p>{{ curWea.windsc }}</p>
      </div>
      <div>
        <p>预警内容</p>
        <div>
          <span v-for="(alarm, index) in hasAlarm(curWea.alarmlist)" :key="index">
            <el-popover
                placement="left-end"
                title="预警详情"
                width="300"
                trigger="hover"
                :content="alarm.level + alarm.type + '预警：' + alarm.content">
                <el-button slot="reference" :style="alarmColor(alarm.level)">
                  {{ alarm.level }}{{ alarm.type }}预警
                </el-button>
              </el-popover>
          </span>
        </div>
      </div>
    </div>
    <nav>
      <router-link :to="{name: 'work', params: {city: areaid}}" :class="routeHome">
        <span class="el-icon-pie-chart"></span> 区域天气
      </router-link>
      <router-link :to="{name: 'daysWea', params: {city: areaid}}" :class="routeDays">
        <span class="el-icon-data-line"></span> 一周天气
      </router-link>
    </nav>
    <div id="routerView">
      <countyWeaVue v-if="active" :initialid="areaid"></countyWeaVue>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import titleBorder from './title.vue'
import citySelector from '../public/citySelect.vue'
import countyWeaVue from './countyWea.vue'
import api from '../../utils/index'

export default {
  components: {titleBorder, citySelector, countyWeaVue},
  beforeRouteEnter (to, from, next) {
    api.getTWea1(to.params.city).then(res => {
      next(vm => {
        vm.curWea = res.data.result
        vm.areaid = to.params.city
      })
    })
      .catch(() => {
        alert('数据接口故障，市区数据暂不更新，可联系平台管理员，即刻为您修复。')
        next(vm => { vm.areaid = to.params.city })
      })
  },
  beforeRouteUpdate (to, from, next) {
    api.getTWea1(to.params.city).then(res => {
      this.curWea = res.data.result
      next()
    })
      .catch(() => {
        alert('数据接口故障，市区数据暂不更新，可联系平台管理员，即刻为您修复。')
        next()
      })
    this.areaid = to.params.city
    to.path.includes('daysWea') ? this.active = false : this.active = true
  },
  data () {
    return {
      active: true, // 路由组件切换时隐藏实时天气数据
      showSelector: false, // 城市选择器开关
      areaid: '101280101',
      curWea: {
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
      }// 接收响应数据，即实时天气情况
    }
  },
  computed: {
    // 处理温度数据，如带单位，就去除单位；否则直接输出
    removeUnit () {
      return (val) => {
        if (typeof val === 'string') {
          let realTemp = val.split('')
          realTemp.pop()
          realTemp = Number(realTemp.join(''))
          return realTemp
        } else {
          return val
        }
      }
    },
    // 按预警级别显示对应颜色
    alarmColor () {
      return val => {
        if (val === '红色') {
          return {background: 'red'} // 红色预警
        } else if (val === '橙色') {
          return {background: 'orange'} // 橙色预警
        } else if (val === '黄色') {
          return {background: 'yellow'} // 黄色预警
        } else if (val === '蓝色') {
          return {background: 'blue'} // 蓝色低温预警
        } else {
          return {background: '#42b883'} // 0预警
        }
      }
    },
    // 紫外线等级
    uvRank () {
      return val => {
        if (val < 3) {
          return '最弱'
        } else if (val < 5) {
          return '弱'
        } else if (val < 7) {
          return '中等'
        } else if (val < 11) {
          return '强'
        } else {
          return '很强'
        }
      }
    },
    // 实时空气质量等级修正
    airRank () {
      return val => {
        if (parseInt(val) < 51) {
          return '优'
        } else if (parseInt(val) < 101) {
          return '良'
        } else if (parseInt(val) < 151) {
          return '轻度污染'
        } else if (parseInt(val) < 201) {
          return '中度污染'
        } else if (parseInt(val) < 301) {
          return '重度污染'
        } else {
          return '严重污染'
        }
      }
    },
    // 天气图标添加
    weatherIcon () {
      if (this.curWea.weatherimg) {
        let weathercode = this.curWea.weatherimg.slice(0, -4)
        return `icon-tianqi-${weathercode}`
      } else {
        return `el-icon-star-off`
      }
    },
    // 选中时，导航栏底部边框颜色变绿
    routeHome () {
      if (this.$route.path.includes('daysWea')) {
        return ''
      } else {
        return 'focusColor'
      }
    },
    // 选中时，导航栏底部边框颜色变绿
    routeDays () {
      if (this.$route.path.includes('daysWea')) {
        return 'focusColor'
      } else {
        return ''
      }
    }
  },
  methods: {
    // 接收城市选择器传过来的地区id
    updatedArea (e) {
      localStorage.setItem('historyAreaid', e)
      setTimeout(() => {
        this.showSelector = false
      }, 1000)
      this.$router.push({name: 'work', params: {city: e}})
    },
    // 判断是否有天气预警
    hasAlarm (params) {
      if (params !== undefined && params.length !== 0) {
        return params
      } else {
        return [{time: '0', content: '当前无预警', level: '当前', type: '无'}]
      }
    }
  },
  mounted () {
    alert('欢迎访问气象分析平台！\n我们将竭诚为您提供便捷、准确的气象数据分析服务！')
  }
}
</script>

<style lang="scss">
// 文字主色
$fontColor:rgba(#fff,.87);
$color10:#B2CCD6;
$color11:#A6ACCD;
// 文字辅色
$subFontColor:rgba(#ebebeb,.6);
$rr:#ffffffde;
// 背景色
$backColor:#1a1a1a;
// 背景辅色
$subBackColor:#242424;
// 主色
$mainColor:#42b883;
// 搭配色
$color1:#f07178;
$color2:#89DDFF;
$color3:#F78C6C;
$color4:#C792EA;
$color5:#C3E88D;
#work{
  height: 100vh;
  width: 100vw;
  min-width: 1400px;
  overflow: auto;
  background-color: $backColor;
  color:$subFontColor;
  font-size: 16px;
  // 市区参数栏
  #urban{
    padding: 10px;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: start;
    >div{
      flex: 1;
      margin: 0 10px;
      padding: 0.5rem;
      height: 120px;
      // 每个盒子设flex
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
      // 溢出处理
      overflow: auto;
      >p{
        margin: 0;
      }
      // 首行字体加粗、深色
      >p:first-child{
        color:$fontColor;
        font-weight: bolder;
      }
      // 第二行字体渐变色
      >p:nth-child(2){
        background: linear-gradient(0deg,$fontColor,$mainColor);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
        font-size: 2em;
      }
      // 天气图标处理
      .iconfont{
        font-size: 1.5em;
      }
      // 高温文字颜色突出
      #temRank{
        font-weight: bolder;
        span{
          color: #ebebeb;
        }
      }
      transition: all 0.5s ease;
      // 悬停变色
      &:hover{
        background: $subBackColor;
        >p:nth-child(2){
          color:$mainColor;
        }
      }
    }
    // 首尾盒子有背景色
    >div:first-child,>div:last-child{
      flex: 2;
      margin: 0;
      border-top: 2px solid rgba($mainColor,.8);
      border-bottom: 2px solid rgba($mainColor,.8);
      background: rgba($mainColor,.2);
    }
    // 第一个盒子：城市
    >div:first-child{
      >p:first-child{
        font-size: 2em;
        font-family: cursive;
      }
      >p:last-child{
        font-size: 0.8em;
      }
      // 切换城市 按钮样式
      button{
        border:none;
        border-radius: 10px;
        color:$subFontColor;
        background: none;
        box-shadow: inset 0 0 10px 0 $fontColor;
        &:hover{
          background: $mainColor;
          box-shadow: none;
          color:$backColor;
          transition: all 0.5s ease;
        }
      }
    }
    // 最后一个盒子的标题左移
    >div:last-child{
      >p:first-child{
        width: 100%;
        text-align: left;
      }
      // element-ui预警按钮样式
      button{
        margin: 2px;
        padding: 5px;
        border: none;
        border-radius: 30px;
        background: transparent;
        font-size: 0.8em;
        font-weight: bolder;
        color: black;
      }
    }
    // 城市选择器样式
    position: relative;
    .cityPosition{
      z-index: 99;
      position: absolute;
      left:5%;
      top:70%;
      background: linear-gradient(45deg,$mainColor,$color1);
    }
  }
  // 导航栏
  >nav{
    width: 100%;
    background-color: $subBackColor;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    // 超链接设置
    a{
      display: inline-block;
      margin: 5px 5px 0 5px;
      border-bottom: 2px solid $subBackColor;
      width: 10rem;
      height: 100%;
      text-align: center;
      font-size: 1.25rem;
      font-weight: bolder;
      text-decoration: none;
      transition: all 0.5s 0.1s linear;
      &:link,&:visited{
        color:$fontColor;
      }
      &:active,&:hover,&:focus{
        color:$mainColor;
        border-bottom: 2px solid $mainColor;
      }
    }
    .focusColor{
      color:$mainColor;
      border-bottom: 2px solid $mainColor;
    }
  }
  // 路由内容容器
  #routerView{
    width: calc(100% - 5px);
    overflow: auto;
  }
}
</style>
