<template>
<div id="mainTitle">
  <div class="titleAside">
    <div class="up">
      <div>left&linear-gradient</div>
      <div>center</div>
      <div>right&skew</div>
    </div>
    <div class="bottom">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <h1>{{ text }}</h1>
  <div class="titleAside">
    <div class="up">
      <div>left&linear-gradient</div>
      <div>center</div>
      <div>right&skew</div>
    </div>
    <div class="bottom">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => {
        return '气象分析平台'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 背景色
$backColor:#1a1a1a;
// 主色
$mainColor:#42b883;
// 顶部大标题边框样式
#mainTitle{
    width: 100%;
    min-width: 900px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: end;
    overflow: hidden;
    // 两侧边框样式
    .titleAside{
      flex: 2;
      .up{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: end;
        >div{
          border-bottom: 2px dashed $mainColor;
          width: 20%;
          height: 25px;
          color: $backColor;
          &:first-child,&:last-child{
            width: 40%;
            border-bottom: 2px solid $mainColor;
          }
          &:first-child{
            border-image: linear-gradient(90deg,transparent 30%,$mainColor) 1;
          }
          &:last-child{
            transform: skew(-50deg);
            border-right: 2px solid $mainColor;
          }
        }
      }
      .bottom{
        margin-top: 5px;
        border-top: 2px solid $mainColor;
        border-image: linear-gradient(90deg,transparent 40%,$mainColor) 1 0 0 0;
        transform: skew(50deg);
        display: flex;
        flex-flow: column nowrap;
        justify-content: start;
        align-items: end;
        >div{
          margin: 2px 0;
          width: 20px;
          height: 5px;
          background: rgba($mainColor,.6);
          &:first-child{
            margin-top: 0;
            background:$mainColor;
          }
          &:last-child{
            margin-bottom: 0;
            background: rgba($mainColor,.2);
          }
        }
      }
      // 右边边框
      &:last-child{
        transform: rotateY(180deg);
      }
    }
    // 中间标题样式
    >h1{
      flex:1;
      margin: 0;
      border-bottom: 2px solid $mainColor;
      border-image: linear-gradient(90deg,$backColor,$mainColor,$backColor) 1;
      width: auto;
      text-align: center;
      color: $mainColor;
      font-family: cursive;
    }
  }
</style>
