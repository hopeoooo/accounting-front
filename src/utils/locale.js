/*
 * @Author:
 * @Date: 2022-01-25 16:17:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-24 22:38:34
 * @Description: file content
 */
import i18n from "@/locales";
import store from "@/store";
import router from '@/router'

const LANG_KEY = "USER_LANG"
// 动态设置语言
export function setLanguage(locale) {
    i18n.locale = locale;
    // 同步到全局状态
    store.commit("app/SET_LANGUAGE", locale);
    // 切换语言后重新加载路由
    // getRoutes()
    // 存储
    return localStorage.setItem(LANG_KEY, locale);
}

export function getLanguage() {
    try {
        // console.log(location);
        let language = "";
        if (localStorage.getItem(LANG_KEY)) {
            language = localStorage.getItem(LANG_KEY);
        } else {
            language = "en";//默认英文
        }

        return language;
    } catch (error) {
        console.log(error);

    }

}

/** 加载路由 */
function getRoutes() {
  store.dispatch('GenerateRoutes').then(accessRoutes => {
    // 根据roles权限生成可访问的路由表
    router.addRoutes(accessRoutes) // 动态添加可访问路由表
    // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
  })
}
