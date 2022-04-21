import request from '@/utils/request'


// 查询桌台列表
export function listTable(query) {
  return request({
    url: '/system/table/list',
    method: 'get',
    params: query
  })
}

// 新增桌台
export function addUpTable(data) {
  return request({
    url: '/system/addOrUpdate',
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