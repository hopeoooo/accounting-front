import request from '@/utils/request'

// 点码||收码 确认修改
export function baccaratEdit(query) {
  return request({
    url: '/bet/baccarat/edit',
    method: 'get',
    params: query
  })
}
// 点码||收码 计算差距
export function baccaratReckon(query) {
  return request({
    url: '/bet/baccarat/reckon',
    method: 'get',
    params: query
  })
}
// 录入
export function baccaratInput(query) {
  return request({
    url: '/bet/baccarat/input',
    method: 'get',
    params: query
  })
}
// 路珠修改
export function baccaratUpdate(data) {
  return request({
    url: '/bet/baccarat/update',
    method: 'post',
    data: data
  })
}
// 开牌
export function baccaratOpen(data) {
  return request({
    url: '/bet/baccarat/open',
    method: 'post',
    data: data
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