import request from '@/utils/request'

// 点码||收码 确认修改
export function niuniuEdit(data) {
  return request({
    url: '/bet/niuniu/edit',
    method: 'post',
    params: data
  })
}
// 点码||收码 计算差距
export function niuniuReckon(data) {
  return request({
    url: '/bet/niuniu/reckon',
    method: 'post',
    params: data
  })
}
// 注单记录
export function niuniuRecord(data) {
  return request({
    url: '/bet/niuniu/record',
    method: 'post',
    params: data
  })
}
// 下一局
export function niuniuNext(data) {
  return request({
    url: '/bet/niuniu/next',
    method: 'post',
    params: data
  })
}
// 录入
export function niuniuInput(query) {
  return request({
    url: '/bet/niuniu/input',
    method: 'post',
    params: query
  })
}

// 开牌
export function niuniuOpen(query) {
  return request({
    url: '/bet/niuniu/open',
    method: 'post',
    params: query
  })
}

// 桌台信息
export function niuniuInfo(data) {
  return request({
    url: '/bet/niuniu/info',
    method: 'post',
    data: data
  })
}
// 注单保存
export function niuniuSave(data) {
  return request({
    url: '/bet/push/save',
    method: 'post',
    data: data
  })
}
// 注单查询
export function niuniuGet(data) {
  return request({
    url: '/bet/push/get',
    method: 'post',
    params: data
  })
}