import request from '@/utils/request'


// 获取获取员工列表
export function getEmployeeList(query) {
  return request({
    url: '/account/user/list',
    method: 'get',
    params: query
  })
}

// 新增员工
export function addEmployee(query) {
  return request({
    url: '/account/user/add',
    method: 'get',
    params: query
  })
}
// 编辑角色
export function updateEmployee(query) {
  return request({
    url: '/account/user/edit',
    method: 'get',
    params: query
  })
}
// 删除角色
export function delEmployee(query) {
  return request({
    url: '/account/user/delete',
    method: 'get',
    params: query
  })
}
