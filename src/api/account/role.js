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
// 获取角色菜单列表树
export function getRoleMenuTree(id) {
  return request({
    url: '/account/role/roleMenuTreeselect/'+id,
    method: 'get',
    // params: query
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

export function delRole(query) {
  return request({
    url: '/account/role/delete',
    method: 'get',
    params: query
  })
}