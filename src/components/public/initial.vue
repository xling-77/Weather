<template>
  <div id="initial">
    <div id="showcity">
      <citySelect v-if="show" @change="updatedArea" innertext="请选择需要查询的城市"></citySelect>
    </div>
    <div class="ballContainer" v-if="!show" @click="show = !show">
      <div class="ball"></div>
      <div class="ballShadow"></div>
    </div>
  </div>
</template>

<script>
import citySelect from '../public/citySelect.vue'

export default {
  components: {
    citySelect
  },
  data () {
    return {
      city: '',
      show: false
    }
  },
  watch: {
    city: {
      handler (cur) {
        if (cur) {
          localStorage.setItem('historyAreaid', cur)
          this.goHome(cur)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 接收城市选择器传过来的地区id
    updatedArea (e) {
      this.city = e
    },
    goHome (val) {
      let userAgent = window.navigator.userAgent
      if (userAgent.includes('Mobile')) {
        this.$router.push({name: 'person'})
      } else {
        this.$router.push({name: 'work', params: {city: val}})
      }
    }
  }
}
</script>

<style lang="scss">
// 字体颜色
$fontColor:#ebfcff;
$size:100px;

body{
  @media screen and (max-width:900px) {
    font-size: 14px;
  }
  /* 基本文字样式 */
  line-height: 1.25;
  font-size: 24px;
  color: $fontColor;
  #initial{
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg,#355c7d,#6c5b7b,#c06c84);
    position: relative;
    #showcity{
      position: absolute;
      top:50%;
      opacity: 0;
      left:50%;
      transform: translate(-50%,-50%) scale(2,2);
      // 过渡动画
      animation: boom 1.5s 1s 1 ease-in forwards;
      @keyframes boom {
        100%{
          transform: translate(-50%,-50%);
          opacity: 1;
        }
      }
    }
    .ball{
      position: absolute;
      top: 50%;
      left:50%;
      transform: translate(-50%,-50%);
      // draw the ball
      border: none;
      border-radius: 50%;
      width: $size;
      height: $size;
      background: radial-gradient(circle at 80% 30%,
        #fff 2px,
        #00ffff 8%,
        #00008b 60%,
        #00ffff 100%);
      box-shadow: inset 0 0 50px #fff;
      // the ball bounce
      animation: bounce 1s alternate infinite ease-in;
      @keyframes bounce {
        100%{
          top:40%;
        }
      }
      transition: all 0.8s linear;
      // if hover,ballShadow hidden && ball's animation none
      &:hover{
        ~.ballShadow{
          animation:none;
          visibility:hidden;
        }
        animation:none;
        background: none;
        box-shadow: inset 0 0 20px #fff;
        cursor: pointer;
      }
    }
    .ballShadow{
      position: absolute;
      top: 50%;
      left:50%;
      // draw the ballShadow
      border-radius: 50%;
      width: $size;
      height: $size;
      transform: translate(-50%,30%) scale(1,0.5);
      background: radial-gradient(rgba(#00008b,0.1) 1px,#6c5b7b);
      // the ballShadow scale
      animation: shadowScale 1s alternate infinite ease-in;
      @keyframes shadowScale {
        100%{
          transform: translate(-50%,30%) scale(0.2,0.1);
        }
      }
    }
  }
}
</style>
