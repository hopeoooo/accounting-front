import request from '@/utils/request'

// 获取菜单列表
// export function getTree(data) {
//   return request({
//     url: '/account/role/tree',
//     method: 'post',
//     data: data
//   })
// }

// 查询注单记录列表
export function listBetRecord(query) {
  return request({
    url: '/bet/record/list',
    method: 'get',
    params: query
  })
}
// 查询注单总计
export function listBetRecordTotal(query) {
  return request({
    url: '/bet/record/total',
    method: 'get',
    params: query
  })
}

// 查询汇款明细列表
export function listRemittanceDetailed(query) {
  return request({
    url: '/system/remittanceDetailed/list',
    method: 'get',
    params: query
  })
}
// 查询汇款总计
export function listRemittanceDetailedTotal(query) {
  return request({
    url: '/system/remittanceDetailed/total',
    method: 'get',
    params: query
  })
}

// 查询签单明细列表
export function listSignedDetailed(query) {
  return request({
    url: '/system/signedDetailed/list',
    method: 'get',
    params: query
  })
}
// 查询客户筹码变动明细列表
export function listSignedDetailed(query) {
  return request({
    url: '查询签单明细列表',
    method: 'get',
    params: query
  })
}