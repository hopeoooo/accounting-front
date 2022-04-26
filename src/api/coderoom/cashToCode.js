import request from '@/utils/request'


// 查询买码换现列表
export function listCashChip(query) {
  return request({
    url: '/system/businessCashChip/list',
    method: 'get',
    params: query
  })
}
// 总计
export function listCashChipTotal(query) {
  return request({
    url: '/system/businessCashChip/total',
    method: 'get',
    params: query
  })
}

// 买码
export function addBuyCode(data) {
  return request({
    url: '/system/businessCashChip/addBuyCode',
    method: 'post',
    data: data
  })
}

// 换现
export function addCashExchange(data) {
  return request({
    url: '/system/businessCashChip/addCashExchange',
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