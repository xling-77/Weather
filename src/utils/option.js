// echarts默认配置

const option = {
  // 系列配色数组：先浅色
  color: ['#42b883', '#f07178', '#89DDFF', 'F78C6C', 'C792EA', 'C3E88D'],
  // 标题样式
  title: {
    left: 'center',
    textStyle: {
      color: 'rgba(255,255,255,0.87)'
    }
  },
  // 坐标轴区域
  grid: {
    top: '20%',
    left: '15%',
    right: '15%'
  },
  // 提示框样式
  tooltip: {
    show: true, // 显示提示框
    trigger: 'axis', // 坐标轴触发
    confine: true, // 将 tooltip 框限制在图表的区域内
    axisPointer: {
      type: 'none'
    },
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: 'transparent',
    textStyle: {
      fontWeight: 'bold',
      color: 'black'
    },
    extraCssText: 'width:200px; white-space:pre-wrap'
  },
  // 图例项。默认不显示。
  legend: {
    show: false
  },
  // 动画效果
  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: function (idx) {
    return Math.random() * 200
  }
}

export default option
