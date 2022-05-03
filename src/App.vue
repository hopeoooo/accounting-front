<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
}
</script>
<style lang="scss">
#app{
  // /* 设置滚动条的样式 */
  //   ::-webkit-scrollbar {
  //       width: 5px;
  //   }
  //   /* 滚动槽 */
  //   ::-webkit-scrollbar-track {
  //       border-radius: 10px;
  //       background: rgba(145, 144, 144, 0.4);
  //   }
  //   /* 滚动条滑块 */
  //   ::-webkit-scrollbar-thumb {
  //       border-radius: 10px;
  //       background: rgba(0, 0, 0, 0.1);
  //       background: rgba(145, 144, 144, 0.4);
  //   }
  //   ::-webkit-scrollbar-thumb:window-inactive {
  //       background: rgba(231, 231, 231, 0.4);
  //   }
  //   .el-dialog__wrapper{
  //     overflow: hidden;
  //   }
}
</style>
