import VueI18n from "vue-i18n";
import Vue from "vue";
import store from "@/store/index";
// import { LANG_KEY } from "@/pc/config/index";
const LANG_KEY = "USER_LANG"
const USER_LANG = localStorage.getItem(LANG_KEY) || "";

// 获取浏览器语言代码
const navigatorLang = navigator.language
    ? navigator.language
    : navigator.userLanguage;
const Nav_Lang = navigatorLang.split("-")[0]; //只获取浏览器语言代码的前面部分


//支持的语言列表
const languages = [
    {
        id: 0,
        label: "简体中文",
        value: "zh",
        // icon:require("../static/images/locales/zh.png")
    },
    {
        id: 1,
        label: "English",
        value: "en",
        // icon:require("../static/images/locales/en.png")
    },
];

const langIcons = {
    zh: require("../assets/images/locales/zh.webp"),
    en: require("../assets/images/locales/en.png"),
};

// 用于接口
export const languageMap = {
    zh: "zh_cn",
    en: "en_us",
};

// 用于网易云盾的图形验证码的语言映射
export const langMap = {
    zh: "zh-CN",
    en: "en",
};

//浏览器语言是否在支持语言的列表
function testBrowserSupport(languages, Nav_Lang) {
    let isSupport = false;
    for (let i = 0; i < languages.length; i++) {
        if (languages[i].value == Nav_Lang) {
            // 浏览器语言在支持列表
            isSupport = true;
        }
    }
    return isSupport;
}

const isSupport = testBrowserSupport(languages, Nav_Lang);

// 导入所有语言包,
function importLangData(languages) {
    let messages = {};
    for (let i = 0; i < languages.length; i++) {
        messages[
            languages[i].value
        ] = require(`./lang/${languages[i].value}.json`);
    }
    return messages;
}

const messages = importLangData(languages);

// 指定默认语言
function setDefaultLanguage(USER_LANG, isSupport, Nav_Lang) {
    let locale = "";
    if (USER_LANG) {
        // 用户有设置过语言
        locale = USER_LANG;
    } else {
        // 用户没有设置过语言
        if (isSupport) {
            // 浏览器语言在支持列表
            locale = Nav_Lang;
        } else {
            // 用户没设置过，浏览器语言也不支持，就默认英文
            locale = "en";
        }
    }
    // 同步到全局状态
    // store.commit("app/SET_LANGUAGE", locale);
    return locale;
}

// 默认语言
const locale = setDefaultLanguage(USER_LANG, isSupport, Nav_Lang);

// 语言配置
export const languagesConfig = {
    languages,
    langIcons,
    locale,
};


// 实现自定义格式
class CustomFormatter {
    constructor(options) {} //  英文处理 将i18n英文单词首字母转大写
    upperCase(text) {
        // /\b([\w|']+)\b/ 去掉全局匹配g的话只有第一个单词的首字母才大写
        return text.replace(/\b([\w|']+)\b/g, function (result) {
            let lowText = result.toLowerCase();
            return lowText.replace(
                lowText.charAt(0),
                lowText.charAt(0).toUpperCase()
            );
        });
    }
    interpolate(message, values) {
        // 返回插值数组
        return [this.upperCase(message)];
    }
}

// 生成i18n实例
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale, //this.$i18n.locale 通过切换locale的值来实现语言切换
    fallbackLocale: locale, // 语言环境中不存在相应massage键时回退到指定语言
    messages,
    formatter: new CustomFormatter(),
});

export default i18n;
