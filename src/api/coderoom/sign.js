import request from '@/utils/request'


// 查询签单列表
export function listSign(query) {
  return request({
    url: '/system/signed/list',
    method: 'get',
    params: query
  })
}
// 总计
export function listSignTotal(query) {
  return request({
    url: '/system/signed/total',
    method: 'get',
    params: query
  })
}

// 签单
export function addSigned(data) {
  return request({
    url: '/system/signed/addSigned',
    method: 'post',
    data: data
  })
}

// 还单
export function addReturnOrder(data) {
  return request({
    url: '/system/signed/addReturnOrder',
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