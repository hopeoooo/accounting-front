/*
 * @Author:
 * @Date: 2022-05-04 13:51:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-04 14:03:13
 * @Description: file content
 */
import request from '@/utils/request'


// 查询洗码费结算列表
export function listWashCode(query) {
  return request({
    url: '/system/water/list',
    method: 'get',
    params: query
  })
}
// 总计
export function listWashCodeTotal(query) {
  return request({
    url: '/system/water/total',
    method: 'get',
    params: query
  })
}

// 结算洗码
export function settlementWater(data) {
  return request({
    url: '/system/water/settlementWater',
    method: 'post',
    data: data
  })
}

// 批量结算洗码
export function batchSettlementWater(data) {
  return request({
    url: '/system/water/batchSettlementWater',
    method: 'post',
    data: data
  })
}

