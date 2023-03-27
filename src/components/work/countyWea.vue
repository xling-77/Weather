<template>
  <div id="county">
    <div v-if="hasCounty">
      <!-- 分页按钮 -->
      <select v-model="curConfig">
        <option disabled>--请选择页码--</option>
        <option :value="page" v-for="(page,index) in countyWea.paging" :key="index">{{`第${index + 1}页`}}</option>
        <option :value="countyWea.data" selected>所有数据</option>
      </select>
      <!-- 实时气温折线图 -->
      <div class="chart"></div>
      <div id="PieAndAll">
        <!-- 天气统计扇形图 -->
        <div class="chart"></div>
        <!-- 数据分析区域 -->
        <div>
          <div id="analysis">
            <div>
              <h3>最高温{{ maxMin('tem').max }}℃</h3>
              <div class="counties">
                <div v-for="(county,index) in maxMin('tem').maxCounties" :key="index">{{ county }}</div>
              </div>
            </div>
            <div>
              <h3>最低温{{ maxMin('tem').min }}℃</h3>
              <div class="counties">
                <div v-for="(county,index) in maxMin('tem').minCounties" :key="index">{{ county }}</div>
              </div>
            </div>
          </div>
          <!-- 全量数据表格 -->
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>区县名称</th>
                <th>天气</th>
                <th>温度</th>
                <th>最高气温</th>
                <th>最低气温</th>
                <th>风向</th>
                <th>风力等级</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(county, index) in countyWea.data" :key="index">
                <td>{{ `${index + 1}` }}</td>
                <td>{{ county.city }}</td>
                <td>{{ county.wea }}</td>
                <td>{{ county.tem }}℃</td>
                <td>{{ county.tem_day }}℃</td>
                <td>{{ county.tem_night }}℃</td>
                <td>{{ county.win }}</td>
                <td>{{ county.win_speed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="!hasCounty">
      <h1>当前城市无下级行政区</h1>
    </div>
  </div>
</template>

<script>
import api from '../../utils/index'
import deOption from '../../utils/option'
import countyCode from '../../assets/json/countyCode.json'

export default {
  props: {
    initialid: {
      type: String,
      default: () => '101280101'
    }
  },
  data () {
    return {
      hasCounty: true, // 有无下级行政区
      curConfig: [], // 区域气温折线图的当前数据页
      resData: [
        {
          'cityid': '101120101',
          'city': '济南',
          'date': '2023-02-23',
          'week': '星期四',
          'update_time': '21:13',
          'wea': '多云',
          'wea_img': 'yun',
          'tem': '7',
          'tem_day': '12',
          'tem_night': '3',
          'win': '西南风',
          'win_speed': '1级',
          'win_meter': '5km/h',
          'air': '55',
          'pressure': '1004',
          'humidity': '54%'
        }
      ] // 响应数据
    }
  },
  computed: {
    // 整理响应数据：1、将响应数据按实时温度大小由大→小排序。2、修复响应数据中无城市名的数据(剔除)。3、统计每种天气出现的次数。4、分页数据处理。5、区县实时气温平均值
    countyWea () {
      let result = {}
      let list = Array.from(this.resData)

      let data = []
      let sortTemp = []
      let count = new Map()
      if (list !== undefined) {
        // 修复响应数据中无城市名的数据(剔除)
        list.forEach((county, index) => {
          if (!county.city) {
            list.splice(index, 1)
          }
        })
        // 获取实时温度
        list.forEach((county) => {
          sortTemp.push(parseInt(county.tem))
          if (count.get(county.wea) !== undefined) {
            let iter = parseInt(count.get(county.wea)) + 1
            count.set(county.wea, iter)
          } else {
            count.set(county.wea, 1)
          }
        })
      }
      // 实时温度由大到小排序
      sortTemp.sort((a, b) => b - a)
      let sumTem = 0
      sortTemp.forEach((tem) => {
        sumTem += parseInt(tem) // 累加温度值，以求平均值
        list.forEach((county) => {
          if (parseInt(county.tem) === parseInt(tem)) {
            data.push(county)
          }
        })
      })

      // 统计每种天气出现的次数
      let weaFrequency = []
      count.forEach((val, key) => {
        let obj = {}
        obj.value = val
        obj.name = key
        weaFrequency.push(obj)
      })

      // 分页数据处理
      let paging = []
      // 每10个一页
      let iter = parseInt(list.length / 10)
      for (let i = 0; i < iter; i++) {
        paging.push(list.splice(0, 10))
      }
      if (list !== undefined && list.length > 0) {
        paging.push(list)
      }
      // 数据整理
      result.avg = sumTem / sortTemp.length // 区县实时气温平均值
      result.data = [...new Set(data)] // 排序后的响应数据
      result.paging = paging // 分页数据
      result.weaFrequency = weaFrequency
      // 返回已排序的数据
      return result
    }
  },
  methods: {
    // 输入areaid，请求更新数据
    getData (value) {
      // 获取下级行政区所有id
      let arr = Array.from(countyCode[value])
      try {
      // 请求限制30个参数。数据最多39个，最少0个。
        if (parseInt(arr.length) > 30) {
          let rest = arr.splice(0, 30)
          let result = []
          Promise.all([api.getYWea1(rest.join(',')), api.getYWea1(arr.join(','))]).then((res) => {
            res.forEach(r => {
              if (r.data[0].update_time) {
                result.push(r.data)
              } else {
                return Promise.reject(r.data)
              }
            })
            if (result) {
              this.resData = result
              this.hasCounty = true
            }
          })
            .catch(err => {
              throw new Error(err)
            })
        } else if (parseInt(arr.length) < 1) {
          this.hasCounty = false
        } else {
          api.getYWea1(arr.join(',')).then((res) => {
            if (res.data[0].update_time) {
              this.resData = res.data
              this.hasCounty = true
            } else {
              return Promise.reject(res.data)
            }
          })
            .catch(err => {
              throw new Error(err)
            })
        }
      } catch (err) {
        console.error(err)
        alert('数据接口故障，数据暂不更新。\n可联系平台管理员，即刻为您修复。')
      }
    },
    drawChart (params) {
      // 图表配置
      let options = []
      let diyOption = {}
      diyOption = {
        dataset: {
          dimensions: ['cityid', 'city', 'date', 'week', 'update_time', 'wea', 'wea_img', 'tem', 'tem_day', 'tem_night', 'win', 'win_speed', 'win_meter', 'air', 'pressure', 'humidity'],
          source: params
        },
        series: [
          {
            name: '实时气温',
            encode: {
              x: 'city',
              y: 'tem'
            },
            label: {
              show: true,
              position: 'top',
              color: 'rgba(235,235,235,0.6)',
              fontSize: '1rem',
              fontWeight: 600,
              formatter: '{@tem}℃'
            },
            // 平均气温线设置
            markLine: {
              symbol: 'none',
              lineStyle: {
                color: 'inherit'
              },
              label: {
                position: 'start',
                distance: 10,
                formatter: params => `平均气温${Math.round(params.value)}℃`,
                color: '#42b883'
              },
              data: [{ yAxis: this.countyWea.avg, name: '平均气温' }]
            },
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0, color: '#42b883'
                  },
                  {
                    offset: 0.5, color: 'rgba(66,184,131,0.5)'
                  },
                  {
                    offset: 0.7, color: 'rgba(66,184,131,0.2)'
                  },
                  {
                    offset: 1, color: 'rgba(66,184,131,0.01)'
                  }
                ],
                global: false // 缺省为 false
              }
            },
            symbolSize: 8
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              show: true,
              type: 'line',
              triggerTooltip: {
                show: true,
                formatter: function (params) {
                  return `${params.name} ${params.data.tem}℃`
                }
              }
            },
            axisTick: {
              show: true,
              inside: true,
              alignWithLabel: true
            },
            axisLabel: {
              color: 'rgba(235,235,235,0.6)',
              fontSize: '1rem'
            }
          }
        ],
        yAxis: {show: false},
        title: {
          text: '实时气温统计图',
          top: 10
        },
        tooltip: {
          trigger: 'item'
        }
      }
      options.push(diyOption)
      // pie chart
      diyOption = {
        series: [
          {
            data: this.countyWea.weaFrequency, // 数据来源
            name: '天气',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              color: 'inherit'
            },
            labelLine: {
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            emphasis: {
              focus: 'self',
              blurScope: 'coordinateSystem',
              label: {
                show: true
              },
              itemStyle: {
                color: 'rgba(235,235,235,0.8)'
              }
            }
          }
        ],
        title: {
          text: '区域天气统计图',
          textStyle: {
            color: 'rgba(255,255,255,0.87)'
          },
          top: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: params => `${params.name} ${Math.round(params.percent)}%`
        }
      }
      options.push(diyOption)
      // 开始画图
      let chartDom = document.getElementsByClassName('chart')
      Array.from(chartDom, (el, i) => {
        this.$echarts.init(el).setOption(deOption)
        this.$echarts.init(el).setOption(options[i])
      })
    },
    // 输入查询参数params，筛选出params最大值、最小值的所有区县名称，返回结果{max：最大值数值，min：最小值数值，maxCounties：[区县1,区县2，...],minCounties:[区县1,区县2，...]}
    maxMin (params) {
      let list = Array.from(this.resData)
      // 1、构建新对象：{区县名称：params的数值}、排序数组[]。
      let temObj = {}
      let temArr = []
      if (list !== undefined) {
        list.forEach((county) => {
          temObj[JSON.stringify(county.city)] = parseInt(county[params])
          temArr.push(parseInt(county[params]))
        })
      }
      // 2、将数值数组排序找出最大值、最小值
      temArr.sort((a, b) => b - a)
      let max = temArr[0]
      let min = temArr[temArr.length - 1]
      // 3、根据最大值、最小值在第一步构建的新对象中找出相应的属性值，即区县名称。
      let maxCounties = []
      let minCounties = []
      for (const key in temObj) {
        if (temObj[key] === max) {
          maxCounties.push(JSON.parse(key))
        }
        if (temObj[key] === min) {
          minCounties.push(JSON.parse(key))
        }
      }
      // 4、输出结果整理
      let result = {}
      result.max = max
      result.min = min
      result.maxCounties = maxCounties
      result.minCounties = minCounties
      return result
    }
  },
  watch: {
    // 监听父组件传递的areaid
    initialid: {
      handler (cur) {
        if (cur) {
          this.getData(cur)
        } else {
          if (localStorage.getItem('historyAreaid')) {
            this.getData(localStorage.getItem('historyAreaid'))
          } else {
            this.getData('101280101')
          }
        }
      },
      // 强制立即执行回调
      immediate: true
    },
    // 监听响应数据
    resData: {
      handler () {
        this.drawChart(this.countyWea.data)
      },
      // 强制立即执行回调
      immediate: true,
      deep: true
    },
    // 监听当前页码
    curConfig: {
      handler (cur) {
        if (cur !== undefined) {
          this.drawChart(cur)
        }
      },
      // 强制立即执行回调
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getData(this.initialid)
  },
  mounted () {
    this.drawChart(this.countyWea.data)
    visualViewport.addEventListener('resize', this.drawChart)
  },
  beforeDestroy () {
    visualViewport.removeEventListener('resize', this.drawChart)
  }
}
</script>

<style lang="scss">
#county{
  padding: 10px;
  width: 100%;
  height: 900px;
  color:inherit;
  // 分页按钮
  select{
    float: left;
    margin: 5px;
    color:#1a1a1a;
  }
  // 图表区域
  .chart{
    margin:10px auto;
    width: 1200px;
    height: 350px;
  }
  // 参数区域
  #PieAndAll{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    >div:first-child{
      flex:1;
    }
    >div:last-child{
      flex:2;
    }
  }
  #analysis{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    >div{
      margin:0 10px;
      width: 250px;
      height: 150px;
      border:2px solid #42b883;
      border-radius: 10px;
      background: #242424;
      overflow: hidden;
      // 标题
      >h3{
        margin-top: 0;
        border-bottom:1px solid #42b883;
        width: 100%;
        background: rgba(#42b883,0.4);
        clip-path: polygon(0 0,100% 0,100% 80%, 80% 80%,70% 100%,30% 100%,20% 80%,0 80%);
        color:rgba(#fff,.87);
        text-align: center;
      }
      .counties{
        padding: 0 10px;
        width: 100%;
        height: 100%;
        overflow: auto;
        >div{
          display: inline-block;
          margin:2px;
          padding: 2px;
          border-bottom:1px solid #42b883;
        }
      }
    }
  }
  table{
    border-collapse: collapse;
    border: 10px solid #1a1a1a;
    width: 100%;
    text-align: center;
    thead{
      color:rgba(#fff,.87);
      background: #42b883;
    }
    tbody{
      tr:nth-child(2n+1){
        background: #242424;
      }
      tr:hover{
        background: #1a1a1a;
        box-shadow:inset 0 0 10px #42b883;
        color:#42b883;
        transition: all 0.5s ease;
      }
    }
  }
}
</style>
