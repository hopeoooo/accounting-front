import request from '@/utils/request'

// 点码||收码 确认修改
export function dragantigerEdit(data) {
  return request({
    url: '/bet/dragontiger/edit',
    method: 'post',
    params: data
  })
}
// 点码||收码 计算差距
export function dragantigerReckon(data) {
  return request({
    url: '/bet/dragontiger/reckon',
    method: 'post',
    params: data
  })
}
// 录入
export function dragantigerInput(query) {
  return request({
    url: '/bet/dragontiger/input',
    method: 'post',
    params: query
  })
}
// 路珠修改
export function dragantigerUpdate(data) {
  return request({
    url: '/bet/dragontiger/update',
    method: 'post',
    params: data
  })
}
// 开牌
export function dragantigerOpen(query) {
  return request({
    url: '/bet/dragontiger/open',
    method: 'post',
    params: query
  })
}
// 赛果列表
export function dragantigerList(data) {
  return request({
    url: '/bet/dragontiger/game',
    method: 'post',
    data: data
  })
}
// 桌台信息
export function dragantigerInfo(data) {
  return request({
    url: '/bet/dragontiger/info',
    method: 'post',
    data: data
  })
}
// 注单保存
export function dragantigerSave(data) {
  return request({
    url: '/bet/push/save',
    method: 'post',
    data: data
  })
}
// 注单查询
export function dragantigerGet(data) {
  return request({
    url: '/bet/push/get',
    method: 'post',
    data: data
  })
}