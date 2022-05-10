import request from '@/utils/request'

// 点码||收码 确认修改
export function sangongEdit(data) {
  return request({
    url: '/bet/sangong/edit',
    method: 'post',
    params: data
  })
}
// 点码||收码 计算差距
export function sangongReckon(data) {
  return request({
    url: '/bet/sangong/reckon',
    method: 'post',
    params: data
  })
}
// 录入
export function sangongInput(query) {
  return request({
    url: '/bet/sangong/input',
    method: 'post',
    params: query
  })
}

// 开牌
export function sangongOpen(query) {
  return request({
    url: '/bet/sangong/open',
    method: 'post',
    params: query
  })
}

// 桌台信息
export function sangongInfo(data) {
  return request({
    url: '/bet/sangong/info',
    method: 'post',
    data: data
  })
}
// 注单保存
export function sangongSave(data) {
  return request({
    url: '/bet/push/save',
    method: 'post',
    data: data
  })
}
// 注单查询
export function sangongGet(data) {
  return request({
    url: '/bet/push/get',
    method: 'post',
    params: data
  })
}