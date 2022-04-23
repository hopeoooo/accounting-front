import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询会员列表
export function listMambers(query) {
  return request({
    url: '/account/mambers/list',
    method: 'get',
    params: query
  })
}
// 查询会员详情
export function listMambersInfo(query) {
  return request({
    url: '/account/mambers/info',
    method: 'get',
    params: query
  })
}
// 新增会员
export function addMambers(query) {
  return request({
    url: '/account/mambers/add',
    method: 'get',
    params: query
  })
}
// 编辑会员
export function updateMambers(query) {
  return request({
    url: '/account/mambers/edit',
    method: 'get',
    params: query
  })
}
// 删除会员
export function delMambers(query) {
  return request({
    url: '/account/mambers/delete',
    method: 'get',
    params: query
  })
}
