<template>
    <div id="citySelector">
      <label for="proSelect">{{ innertext }}</label>
      <!-- 省级选择框 -->
      <select v-model="proArea">
        <option disabled value="">--选择省--</option>
        <option v-for="province in cityallData"
          :key="province.provinceName"
          :value="province.provinceName">
          {{ province.provinceName }}
        </option>
      </select>
      <!-- 市级选择框 -->
      <select v-model="cityArea" v-on:change="sendID">
        <option disabled value="">--选择市--</option>
        <option v-for="city in cityData" :key="city.id" :value="city.id">{{ city.cityZh }}</option>
      </select>
    </div>
</template>

<script>
import all from '../../assets/json/allcities.json'

export default {
  props: {
    innertext: {
      type: String,
      default: function () {
        return '切换城市'
      }
    }
  },
  data () {
    return {
      proArea: '', // 选择的**省
      cityData: [], // 所选择的**省下的所有市
      cityArea: '', // 选择的**市
      countyData: [], // 所选择的**市下的所有区县
      cityallData: all // 所有城市数据
    }
  },
  watch: {
    // 监听选择的**省，再显示其下属所有的市级行政区
    proArea: function (cur) {
      let that = this
      if (all.length > 0) {
        let temp = Array.from(all)
        temp.forEach((pro) => {
          if (pro.provinceName === cur) {
            that.cityData = pro.cities
          }
        })
      }
    }
  },
  methods: {
    // 选择器最后传递的参数
    sendID (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style lang="scss">
// 列表框样式
#citySelector{
  border: 1px solid #ebfcff;
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  // 下拉选择框样式
  select{
    margin:1rem 0;
    width: 10rem;
    height: 1.5rem;
    border: 2px solid #ebfcff;
    border-radius: 10px;
    color: #000;
  }
}
</style>
