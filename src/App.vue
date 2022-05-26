<!--
 * @Author:
 * @Date: 2022-05-24 13:49:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-26 11:35:49
 * @Description: file content
-->
<template>
  <div id="app" :class="currentLanguage=='en'?'app_en':'app_zh'">
    <router-view  v-if="isRouterAlive"/>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default  {
  name:  'App',
   provide() {
        return { reload: this.reload };
    },
  data(){
     return  { isRouterAlive: true };
  },
  computed: {
    ...mapState("app",['currentLanguage'])
  },
  methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function() {
                this.isRouterAlive = true;
            });
        },

    },
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
