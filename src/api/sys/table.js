import request from '@/utils/request'


// 查询桌台列表
export function listTable(query) {
  return request({
    url: '/system/table/list',
    method: 'get',
    params: query
  })
}
// 查询桌台总计
export function listTableTotal(query) {
  return request({
    url: '/system/table/total',
    method: 'get',
    params: query
  })
}
// 桌台下拉框
export function tableIdComboBoxInfo(query) {
  return request({
    url: '/system/table/tableIdComboBoxInfo',
    method: 'get',
    params: query
  })
}
// 新增桌台
export function addUpTable(data) {
  return request({
    url: '/system/table/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除桌台
export function delTable(tableId) {
  return request({
    url: '/system/table/' + tableId,
    method: 'delete'
  })
}