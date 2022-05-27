import request from '@/utils/request'


// 获取获取荷官列表
export function getDealerList(query) {
  return request({
    url: '/account/dealer/list',
    method: 'get',
    params: query
  })
}
//校验荷官工号
export function getDealerCheckUserName(query) {
  return request({
    url: '/account/dealer/checkUserName',
    method: 'get',
    params: query
  })
}
// 新增荷官
export function addDealer(query) {
  return request({
    url: '/account/dealer/add',
    method: 'get',
    params: query
  })
}
// 编辑角色
export function updateDealer(query) {
  return request({
    url: '/account/dealer/edit',
    method: 'get',
    params: query
  })
}
// 删除角色
export function delDealer(query) {
  return request({
    url: '/account/dealer/delete',
    method: 'get',
    params: query
  })
}
