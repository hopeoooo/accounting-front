import request from '@/utils/request'


// 存取码列表
export function listAccessCode(query) {
  return request({
    url: '/system/accessCode/list',
    method: 'get',
    params: query
  })
}
// 总计
export function listAccessCodeTotal(query) {
  return request({
    url: '/system/accessCode/total',
    method: 'get',
    params: query
  })
}

// 存码
export function saveCode(data) {
  return request({
    url: '/system/accessCode/saveCode',
    method: 'post',
    data: data
  })
}

// 取码
export function updateCodeFetching(data) {
  return request({
    url: '/system/accessCode/updateCodeFetching',
    method: 'post',
    data: data
  })
}
// export function delTable(tableId) {
//   return request({
//     url: '/system/table/' + tableId,
//     method: 'delete'
//   })
// }