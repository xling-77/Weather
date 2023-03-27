<template>
  <div id="daysWea"></div>
</template>

<script>
import deOption from '../../utils/option'
import api from '../../utils/index'

export default {
  beforeRouteEnter (to, from, next) {
    api.getYWea7(to.params.city).then((res) => {
      if (res.data.errcode) {
        return Promise.reject(res.data.errmessage)
      } else {
        next(vm => {
          vm.daysWea = res.data
        })
      }
    })
      .catch(() => {
        alert('数据接口故障，数据暂不更新。\n可联系平台管理员，即刻为您修复。')
        next()
      })
  },
  data () {
    return {
      areaid: '', // 路由传递过来的城市id
      daysWea: [
        {
          'date': '2023-03-19',
          'wea': '晴',
          'wea_img': 'qing',
          'tem_day': '47',
          'tem_night': '4',
          'win': '北风',
          'win_speed': '3-4级'
        }
      ] // 请求所得数据
    }
  },
  computed: {
    // 配置多x轴的数组数据
    datesArr () {
      let result = []
      let list = Array.from(this.daysWea.data)
      if (list !== undefined) {
        list.forEach((params) => {
          result.push(params.date) // 从请求数据中获取日期
        })
      }
      return result
    }
  },
  methods: {
    // 绘制echarts图表
    drawChart () {
      // 图表配置
      let diyOption = {
        dataset: {
          dimensions: ['date', 'tem_day', 'tem_night', 'wea', 'wea_img', 'win', 'win_speed'],
          source: this.daysWea.data
        },
        // 多条x轴
        xAxis: [
          // x:date
          {
            id: 'date',
            type: 'category',
            data: this.datesArr,
            axisLine: {
              show: false, // 不显示坐标轴线
              onZero: false // offset必备条件
            },
            axisTick: {
              show: true,
              inside: true,
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              color: 'inherit',
              fontSize: '1rem',
              fontWeight: 'bold',
              formatter: params => params.slice(5)
            },
            axisPointer: {
              show: true,
              type: 'line',
              lineStyle: {
                color: 'inherit'
              }
            }
          },
          // x:week
          {
            id: 'week',
            type: 'category',
            data: this.datesArr,
            axisLine: {
              show: false, // 不显示坐标轴线
              onZero: false // offset必备条件
            },
            offset: 25,
            position: 'bottom',
            axisTick: {
              show: false // 不显示坐标轴刻度
            },
            axisLabel: {
              show: true,
              color: 'inherit',
              fontSize: '0.8rem',
              formatter: function (params) {
                let date = new Date(params)
                let weekzh = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                return weekzh[date.getDay()]
              }
            }
          }
        ],
        series: [
          // 低温线
          {
            name: '最低温度',
            type: 'line',
            encode: {
              x: 'date',
              y: 'tem_night'
            },
            smooth: true,
            lineStyle: {
              width: 3
            },
            label: {
              show: true,
              position: 'bottom',
              color: 'inherit',
              fontSize: '1rem',
              fontWeight: 600,
              formatter: '{@tem_night}℃'
            },
            symbolSize: 6,
            markPoint: {
              symbolSize: 10,
              symbol: 'circle',
              label: {
                show: false
              },
              data: [
                {
                  name: '最小值',
                  type: 'min'
                }
              ]
            },
            markLine: {
              symbol: 'none',
              data: [
                {
                  name: '红色气温预警40℃',
                  yAxis: 40,
                  lineStyle: {color: 'red'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '红色气温预警-25℃',
                  yAxis: -25,
                  lineStyle: {color: 'red'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '橙色气温预警37℃',
                  yAxis: 37,
                  lineStyle: {color: 'orange'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '橙色气温预警-20℃',
                  yAxis: -20,
                  lineStyle: {color: 'orange'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '黄色气温预警35℃',
                  yAxis: 35,
                  lineStyle: {color: 'yellow'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '黄色气温预警-15℃',
                  yAxis: -15,
                  lineStyle: {color: 'yellow'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                },
                {
                  name: '蓝色气温预警-10℃',
                  yAxis: -10,
                  lineStyle: {color: 'blue'},
                  label: {
                    formatter: '{b}',
                    color: 'inherit'
                  }
                }
              ]
            }
          },
          // 高温线
          {
            name: '最高温度',
            type: 'line',
            encode: {
              x: 'date',
              y: 'tem_day'
            },
            smooth: true,
            lineStyle: {
              width: 3
            },
            areaStyle: {
              origin: 'start',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0, color: '#f07178'
                  },
                  {
                    offset: 0.5, color: 'rgba(240,113,120,0.5)'
                  },
                  {
                    offset: 0.7, color: 'rgba(240,113,120,0.2)'
                  },
                  {
                    offset: 1, color: 'rgba(240,113,120,0.01)'
                  }
                ],
                global: false // 缺省为 false
              }
            },
            label: {
              show: true,
              position: 'top',
              color: 'inherit',
              fontSize: '1rem',
              fontWeight: 600,
              formatter: '{@tem_day}℃'
            },
            symbolSize: 6,
            markPoint: {
              symbolSize: 10,
              symbol: 'circle',
              label: {
                show: false
              },
              data: [
                {
                  name: '最大值',
                  type: 'max'
                }
              ]
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '温度/°C',
            nameTextStyle: {
              align: 'right',
              color: 'rgba(235,235,235,.6)'
            },
            // 坐标轴刻度标签设置
            axisLabel: {
              formatter: '{value} °C'
            },
            max: 'dataMax',
            min: function (value) {
              return value.min - 5
            },
            // 分割线（即数据对应的y轴数据线）相关设置
            splitLine: {
              show: true,
              lineStyle: {color: 'rgba(235,235,235,.4)'}
            }
          }
        ],
        // 提示框样式
        tooltip: {
          formatter: function (params) {
            let diffDate = new Date() - new Date(params[0].name) // 计算实时与data日期的毫秒数差值
            let totalDays = Math.floor(diffDate / (1000 * 60 * 60 * 24)) // 转换毫秒数差值为整数——天数。1为昨天，0为今天，-1为明天，以此类推。
            if (totalDays === 0) {
              return `<div style="text-align:justify;">今日<br>天气：${params[0].value.wea}<br>最高气温${params[0].value.tem_day}℃<br>最低气温${params[0].value.tem_night}℃</div>` // 必须有个html元素才会显示提示框。且可以添加style样式。
            } else if (totalDays === -1) {
              return `<div style="text-align:justify;">明日<br>天气：${params[0].value.wea}<br>最高气温${params[0].value.tem_day}℃<br>最低气温${params[0].value.tem_night}℃</div>`
            } else {
              return `<div style="text-align:justify;">${params[0].value.date.slice(5)}<br>天气：${params[0].value.wea}<br>最高气温${params[0].value.tem_day}℃<br>最低气温${params[0].value.tem_night}℃</div>`
            }
          }
        },
        title: {
          text: `${this.daysWea.city}近一周天气统计图`,
          textStyle: {
            color: 'rgba(255,255,255,0.87)'
          },
          top: 10
        }
      }
      // 绘制图表
      let chart = this.$echarts.init(document.getElementById('daysWea'))
      chart.setOption(deOption)
      chart.setOption(diyOption)
    }
  },
  watch: {
    daysWea: {
      handler (cur) {
        if (cur) {
          this.$nextTick(() => {
            this.drawChart()
          })
        }
      },
      // 强制立即执行回调
      immediate: true
    }
  },
  mounted () {
    this.drawChart()
    visualViewport.addEventListener('resize', this.drawChart)
  },
  beforeDestroy () {
    visualViewport.removeEventListener('resize', this.drawChart)
  }
}
</script>

<style lang="scss">
#daysWea{
  margin:10px auto;
  width: 1200px;
  height: 500px;
  color:inherit;
}
</style>
