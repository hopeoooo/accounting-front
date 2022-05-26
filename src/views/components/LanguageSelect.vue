<!--
 * @Author:
 * @Date: 2021-12-07 13:31:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-26 22:18:36
 * @Description: 语言选择框
-->
<template>
  <div class="language-select-component-pc">
    <el-select
      v-model="selectedLanguage"
      size="medium"
      placeholder="请选择语言"
      class="lang-select-box"
      popper-class="select-language-popup-pc"
      @change="onLanguageChange"
      tabindex="-1"
    >
      <template slot="prefix" class="prefixSlot">
        <img class="prefix-img" :src="langIcons[selectedLanguage]" alt srcset />
      </template>
      <el-option
        v-for="item in languages"
        :key="item.id"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right" class="lang-opt-imgbox">
          <img :src="langIcons[item.value]" class="lang-opt-img" />
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue'
import Element from 'element-ui'
import { mapState, mapMutations } from "vuex";
import { languagesConfig, langMap } from "@/locales/index";
import { setLanguage } from "@/utils/locale";
import store from "../../store";
import router from "../../router";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
export default {
  /**语言选择 */
  name: "LanguageSelect",
  inject:['reload'],
  data() {
    return {
      languages: languagesConfig.languages,
      selectedLanguage: this.$store.state.app.currentLanguage,
      langIcons: languagesConfig.langIcons
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"])
  },
  mounted() {
    console.log(this.$i18n.locale);
  },
  watch: {
    currentLanguage(val) {
      // this.changeRouter();
      location.reload()
    }
  },
  methods: {
    /**选择语言 */
    onLanguageChange(val) {
      //   console.log("选择语言", val);
      setLanguage(val);
      //   this.$t.locale = val;
      //  this.$i18n.locale = type;
      //   document.title = `${i18n.t('meta.'+this.$route.meta.title)} - ${i18n.t('meta.base')}`
    },

    // 路由切换
    changeRouter() {
      // this.reload()
      store.dispatch("GenerateRoutes").then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes); // 动态添加可访问路由表
        // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      });
    }
  }
};
</script>

<style lang="scss">
.language-select-component-pc {
  //   position: absolute;
  width: 140px;
  height: 36px;
  // top: 30px;
  // right: 80px;
  .lang-select-box {
    display: block;
    text-align: right;
    cursor: pointer;
    font-size: 18px;
    width: 100%;
    height: 100%;
    // line-height: 30px;
    // bottom: 10px;
    // top: 32px;
    // position: absolute;
    background: none;

    .el-input {
      width: 100%;
      .el-input__inner {
        width: 100%;
        background: none;
        border: none;
        box-shadow: none;
        color: #000;
        font-size: 14px;
        padding-left: 0;
        padding-right: 0;
        text-indent: 10px;
      }
      .el-input__prefix {
        display: flex;
        align-items: center;
        position: absolute;
        width: 20px;
        left: 80px;
        .prefix-img {
          width: 100%;
        }
      }
      .el-input__suffix {
        .el-icon-arrow-up:before {
          font-size: 18px;
          color: #d1b58e;
          font-weight: bold;
        }
      }
    }
  }
}

.el-select-dropdown.select-language-popup-pc {
  background: none;
  border: none;
  top: 40px !important;
  .popper__arrow {
    display: none;
  }

  .el-select-dropdown__list {
    .el-select-dropdown__item {
      padding: 10px 15px 10px 10px;

      background: linear-gradient(0deg, #d8ac79, #ebdab4);
      color: #524740;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
    }
    .el-select-dropdown__item.selected {
      color: #fff;
      background: linear-gradient(0deg, #1e2a38, #344d6b);
      box-shadow: none;
    }

    .el-select-dropdown__item:first-child {
      border-radius: 7px 7px 0px 0px;
    }
    .el-select-dropdown__item:last-child {
      border-radius: 0px 0px 7px 7px;
    }
  }

  .lang-opt-imgbox {
    display: flex;
    align-items: center;
    .lang-opt-img {
      width: 20px;
      margin-left: 5px;
    }
  }
}
</style>
