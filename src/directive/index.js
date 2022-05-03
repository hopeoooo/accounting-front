/*
 * @Author:
 * @Date: 2022-04-30 10:22:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-03 21:23:02
 * @Description: file content
 */
import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import preventReClick from './permission/preventReClick'
import dialogDrag from './dialog/drag'
import dialogDragWidth from './dialog/dragWidth'
import dialogDragHeight from './dialog/dragHeight'
import clipboard from './module/clipboard'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('prclick', preventReClick)
  Vue.directive('clipboard', clipboard)
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('dialogDragWidth', dialogDragWidth)
  Vue.directive('dialogDragHeight', dialogDragHeight)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['prClick'] = preventReClick
  Vue.use(install); // eslint-disable-line
}

export default install
