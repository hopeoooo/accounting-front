import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getIP } from '@/utils/getip'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from "@/utils/ruoyi";
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import i18n, { languageMap } from '@/locales/index.js'
let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  // timeout: 10000
})
if (process.env.NODE_ENV === "development") {
  service.defaults.baseURL = process.env.VUE_APP_BASE_API;
} else if (process.env.NODE_ENV === "debug") {
  service.defaults.baseURL = "/bug";
} else if (process.env.NODE_ENV === "production") {
  service.defaults.baseURL = VUE_APP_BASE_API.baseUrl;
}

service.defaults.timeout = 10000;


// request拦截器
service.interceptors.request.use(config => {
  // 给每个请求加请求头加上当前语言
  config.headers.language = languageMap[i18n.locale]
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Client-Local-IP'] =  getIP()
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      if(sessionObj.url !='/bet/push/save' && sessionObj.url!='/bet/push/get'){
        const s_url = sessionObj.url;                  // 请求地址
        const s_data = sessionObj.data;                // 请求数据
        const s_time = sessionObj.time;                // 请求时间
        const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = this.$t('sys_tips_cnt2');
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }

    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
      return res.data
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        MessageBox.confirm(this.$t('sys_tips_cnt1'), this.$t('sys_tips_title1'), {
          confirmButtonText: this.$t('relogin'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning'
        }
      ).then(() => {
        isRelogin.show = false;
        store.dispatch('user/LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {
        isRelogin.show = false;
      });
    }
      return Promise.reject(this.$t('sys_tips_cnt3'))
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = this.$t('sys_tips_cnt4');
    }
    else if (message.includes("timeout")) {
      message = this.$t('sys_tips_cnt5');
    }
    else if (message.includes("Request failed with status code")) {
      message = this.$t('sys_tips_cnt6') + message.substr(message.length - 3) + this.$t('sys_tips_cnt7');
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({ text: this.$t('sys_tips_cnt8'), spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error(this.$t('sys_tips_cnt9'))
    downloadLoadingInstance.close();
  })
}

export default service
