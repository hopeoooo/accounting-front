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
export function addEmployee(data) {
  return request({
    url: '/account/user/add',
    method: 'post',
    data: data
  })
}
// 编辑角色
export function updateEmployee(data) {
  return request({
    url: '/account/user/edit',
    method: 'post',
    data: data
  })
}
// 删除角色
export function delEmployee(id) {
  return request({
    url: '/account/user/delete' + id,
    method: 'delete'
  })
}
