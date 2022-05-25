import request from '@/utils/request'

// 点码||收码 确认修改
export function pusherEdit(data) {
  return request({
    url: '/bet/pusher/edit',
    method: 'post',
    params: data
  })
}
// 点码||收码 计算差距
export function pusherReckon(data) {
  return request({
    url: '/bet/pusher/reckon',
    method: 'post',
    params: data
  })
}
// 注单记录
export function pusherRecord(data) {
  return request({
    url: '/bet/pusher/record',
    method: 'post',
    params: data
  })
}
// 下一局
export function pusherNext(data) {
  return request({
    url: '/bet/pusher/next',
    method: 'post',
    params: data
  })
}
// 录入   
export function pusherInput(query) {
  return request({
    url: '/bet/pusher/input',
    method: 'post',
    params: query
  })
}

// 开牌
export function pusherOpen(query) {
  return request({
    url: '/bet/pusher/open',
    method: 'post',
    params: query
  })
}

// 桌台信息
export function pusherInfo(data) {
  return request({
    url: '/bet/pusher/info',
    method: 'post',
    data: data
  })
}
// 注单保存
export function pusherSave(data) {
  return request({
    url: '/bet/push/save',
    method: 'post',
    data: data
  })
}
// 注单查询
export function pusherGet(data) {
  return request({
    url: '/bet/push/get',
    method: 'post',
    params: data
  })
}