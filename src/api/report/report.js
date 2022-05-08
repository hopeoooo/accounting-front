/*
 * @Author:
 * @Date: 2022-04-30 10:22:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-08 17:59:02
 * @Description: file content
 */
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
export function listChipRecord(query) {
  return request({
    url: '/system/chipRecord/list',
    method: 'get',
    params: query
  })
}
// 查询结算洗码费明细列表
export function listWaterDetailed(query) {
  return request({
    url: '/system/waterDetailed/list',
    method: 'get',
    params: query
  })
}


// 查询结算洗码费总计
export function totalWaterDetailed(query) {
  return request({
    url: '/system/waterDetailed/total',
    method: 'get',
    params: query
  })
}


// 查询存取码明细列表
export function listAccessCodeDetailed(query) {
  return request({
    url: '/system/accessCodeDetailed/list',
    method: 'get',
    params: query
  })
}
