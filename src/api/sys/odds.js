import request from '@/utils/request'


// 查询赔率设置
export function listOdds(query) {
  return request({
    url: '/system/oddsConfig/list',
    method: 'get',
    params: query
  })
}

// 修改赔率设置
export function UpOdds(data) {
  return request({
    url: '/system/oddsConfig',
    method: 'post',
    data: data
  })
}
