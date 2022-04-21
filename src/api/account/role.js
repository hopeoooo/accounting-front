import request from '@/utils/request'


// 获取菜单列表
export function getTree(data) {
  return request({
    url: '/account/role/tree',
    method: 'post',
    data: data
  })
}
// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/account/role/list',
    method: 'post',
    data: data
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/account/role/add',
    method: 'post',
    data: data
  })
}
// 编辑角色
export function updateRole(data) {
  return request({
    url: '/account/role/edit',
    method: 'post',
    data: data
  })
}
// 删除角色
export function delRole(roleId) {
  return request({
    url: '/account/role/delete' + roleId,
    method: 'delete'
  })
}
