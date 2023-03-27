# 生活助手&气象综合分析平台

> Urban Weather Data Visualization System Based on Vue, mainly Echarts and Axios configured.

- **天气数据可视化**，实时获知当前天气情况及预警及近期天气情况，助力相关专业人士分析。
- **主要技术**：Vue组件化开发、Echarts图表配置、Scss、全屏拖拽功能指令、flex && @media响应式布局、Axios请求封装（拦截器、本地缓存命中、取消请求、并发请求）。

## 在线体验

地址：[https://xling-77.github.io/Weather/](https://xling-77.github.io/Weather/)

## 内置功能及实现技术
> 页面逻辑
> 1. 首次访问
> - 手机访问：初始化页面→选择城市→生活助手。
> - 非手机访问：初始化页面→选择城市→气象综合分析平台。
>
> 2. 再度访问
> - 手机访问：生活助手，并自动查询上次选择城市天气。
> - 非手机访问：气象综合分析平台，并自动查询上次选择城市及其下级行政区天气。

### 一、初始化页面

|功能|技术|
|:---|:---|
|弹跳小球|CSS动画|
|选择城市|封装组件：全国城市选择器|
|页面跳转|VueRouter路由跳转|

### 二、手机访问
|功能|技术|优化点|
|:---|:---|:---|
|获取天气及预警数据|Axios请求封装|资源优化：通过Axios拦截器对响应数据进行判断，通过sessionStorage进行本地缓存，从而减少http请求次数，节省资源。
|城市切换|封装组件：全国城市选择器|
|自动记忆上次选择城市|localStorage API本地缓存|
|背景模糊|backdrop-filter设置|兼容性优化：添加-webkit-backdrop-filter|
|壁纸点击切换|绑定click事件，点击即更换背景图片源，连接网络实时请求图片|1. 图片懒加载。2. 修复壁纸切换白屏。|
|壁纸按钮全屏拖拽功能|touch事件、drag事件|1. 修复触点与移动目标的坐标偏移。2. 兼容移动端、PC。|
|今日贴士按钮|ElementUI组件|
|智能预警提示按钮|ElementUI组件、v-if判断有预警才显示按钮|

### 三、非手机端访问
> 一般指电脑访问。

|功能|技术|优化点|
|:---|:---|:---|
|获取天气及预警数据|Axios请求封装|资源优化：通过Axios拦截器对响应数据进行判断，通过sessionStorage进行本地缓存，从而减少http请求次数，节省资源。|
|城市切换|封装组件：全国城市选择器|逻辑优化：v-model绑定选择的范围。|
|自动记忆上次选择城市|localStorage API本地缓存|
|智能预警加载|1. v-if判断有预警才加载。2. computed根据预警颜色返回对应预警样式。|逻辑优化：无预警时设置默认样式|
|实时气温统计图、区域天气统计图、一周天气统计图|Echarts图表配置|代码优化：1. 批量加载图表。2. 图表公共样式封装。|
|实时气温统计图分页下拉表|select下拉表+v-model|资源优化：通过computed对响应数据分组处理形成二维数组（即分页后的每页数据），无需重复请求|
|最高/低温区域统计|排序+分类处理|
|区域天气与一周天气切换|路由切换、路由守卫|代码优化：在路由守卫中请求数据，导航完成前更新数据。

## 参数设置

> 项目第三方依赖：echarts、axios、ElementUI、scss。本地运行请先初始化vue项目，安装相关依赖。

- 城市选择器可选择至区县：进入citySelect.vue，将市级选择框的v-on清除，将区县选择框的注释标记清除，将data中的countyData的注释标记清除。

# 后期计划

逐步完善功能并优化页面，完善请求封装。成长期，欢迎留言指教 ;)
