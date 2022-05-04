import request from '@/utils/request'

// 点码||收码 确认修改
export function baccaratEdit(data) {
  return request({
    url: '/bet/baccarat/edit',
    method: 'post',
    params: data
  })
}
// 点码||收码 计算差距
export function baccaratReckon(data) {
  return request({
    url: '/bet/baccarat/reckon',
    method: 'post',
    params: data
  })
}
// 录入
export function baccaratInput(query) {
  return request({
    url: '/bet/baccarat/input',
    method: 'post',
    params: query
  })
}
// 路珠修改
export function baccaratUpdate(data) {
  return request({
    url: '/bet/baccarat/update',
    method: 'post',
    params: data
  })
}
// 开牌
export function baccaratOpen(query) {
  return request({
    url: '/bet/baccarat/open',
    method: 'post',
    params: query
  })
}
// 赛果列表
export function baccaratList(data) {
  return request({
    url: '/bet/baccarat/game',
    method: 'post',
    data: data
  })
}
// 桌台信息
export function baccaratInfo(data) {
  return request({
    url: '/bet/baccarat/info',
    method: 'post',
    data: data
  })
}
// 注单保存
export function baccaratSave(data) {
  return request({
    url: '/bet/push/save',
    method: 'post',
    data: data
  })
}
// 注单查询
export function baccaratGet(data) {
  return request({
    url: '/bet/push/get',
    method: 'post',
    data: data
  })
}