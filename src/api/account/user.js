import request from '@/utils/request'




// 新增角色
export function avatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 个人中心

export function userinfo() {
  return request({
    url: '/system/user/profile/info',
    method: 'get',
  })
}