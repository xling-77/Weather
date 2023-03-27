<template>
  <div id="app">
    <router-view name="mainView"></router-view>
  </div>
</template>

<script>

export default{
  name: 'App',
  methods: {
    // 判断设备类型、本地缓存有无
    goHome () {
      let userAgent = window.navigator.userAgent
      if (localStorage.getItem('historyAreaid')) {
        if (userAgent.includes('Mobile')) {
          this.$router.push({name: 'person'})
        } else {
          this.$router.push({name: 'work', params: {city: localStorage.getItem('historyAreaid')}})
        }
      } else {
        this.$router.push({path: '/initial'})
      }
    }
  },
  created () {
    // this.goHome()
    this.$router.push({name: 'person'})
  }
}
</script>

<style lang="scss">
*{
  box-sizing: border-box;
  // 滚动条设置
  &::-webkit-scrollbar{
    width:5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track-piece{
    background-color: #242424;
  }
  &::-webkit-scrollbar-corner{
    display: none;
  }
  &::-webkit-scrollbar-thumb{
    background-color:rgba(#A6ACCD, 0.5);
    &:hover{
      background:#A6ACCD;
    }
  }
}
body{
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  line-height: 1.25;
  font-size: 16px;
  font-weight: 400;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Avenir', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
