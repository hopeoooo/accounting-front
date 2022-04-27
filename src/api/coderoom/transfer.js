import request from '@/utils/request'


// 查询汇款列表
export function listRemittance(query) {
  return request({
    url: '/system/remittance/list',
    method: 'get',
    params: query
  })
}
// 总计
export function listRemittanceTotal(query) {
  return request({
    url: '/system/remittance/total',
    method: 'get',
    params: query
  })
}

// 汇入
export function addImport(data) {
  return request({
    url: '/system/remittance/addImport',
    method: 'post',
    data: data
  })
}

// 会出
export function addRemit(data) {
  return request({
    url: '/system/remittance/addRemit',
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