/*
 * @Author:
 * @Date: 2022-04-30 10:22:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-27 14:46:25
 * @Description: file content
 */
import request from '@/utils/request'

// 获取菜单列表
// export function getTree(data) {
//   return request({
//     url: '/account/role/tree',
//     method: 'post',
//     data: data
//   })
// }

// 查询注单记录列表
export function listBetRecord(query) {
  return request({
    url: '/bet/record/list',
    method: 'get',
    params: query
  })
}
// 查询注单总计
export function listBetRecordTotal(query) {
  return request({
    url: '/bet/record/total',
    method: 'get',
    params: query
  })
}

// 注单修改
export function editBetRecord(data) {
  return request({
    url: '/bet/record/edit',
    method: 'post',
    params: data
  })
}

// 注单补录
export function repairBetRecord(data) {
  return request({
    url: '/bet/record/repair',
    method: 'post',
    params: data
  })
}
// 查询汇款明细列表
export function listRemittanceDetailed(query) {
  return request({
    url: '/system/remittanceDetailed/list',
    method: 'get',
    params: query
  })
}
// 查询汇款总计
export function listRemittanceDetailedTotal(query) {
  return request({
    url: '/system/remittanceDetailed/total',
    method: 'get',
    params: query
  })
}

// 查询签单明细列表
export function listSignedDetailed(query) {
  return request({
    url: '/system/signedDetailed/list',
    method: 'get',
    params: query
  })
}
// 查询客户筹码变动明细列表
export function listChipRecord(query) {
  return request({
    url: '/system/chipRecord/list',
    method: 'get',
    params: query
  })
}
// 查询结算洗码费明细列表
export function listWaterDetailed(query) {
  return request({
    url: '/system/waterDetailed/list',
    method: 'get',
    params: query
  })
}


// 查询结算洗码费总计
export function totalWaterDetailed(query) {
  return request({
    url: '/system/waterDetailed/total',
    method: 'get',
    params: query
  })
}


// 查询存取码明细列表
export function listAccessCodeDetailed(query) {
  return request({
    url: '/system/accessCodeDetailed/list',
    method: 'get',
    params: query
  })
}

// 查询注单修改记录列表
export function listBetUpdate(query) {
  return request({
    url: '/bet/update/list',
    method: 'get',
    params: query
  })
}
// 查询点码列表
export function listPorint(query) {
  return request({
    url: '/sys/porint/list',
    method: 'get',
    params: query
  })
}

// 点码修改 确认修改
export function editPorint(query) {
  return request({
    url: '/sys/porint/edit',
    method: 'post',
    params: query
  })
}
// 点码修改  计算差距
export function reckonPorint(query) {
  return request({
    url: '/sys/porint/reckon',
    method: 'post',
    params: query
  })
}

// 点码修改列表
export function listUpdatePorint(query) {
  return request({
    url: '/sys/porint/update/list',
    method: 'get',
    params: query
  })
}

// 查询收码报表
export function listReceipt(query) {
  return request({
    url: '/sys/receipt/list',
    method: 'get',
    params: query
  })
}

// 查询输赢报表
export function listWinLose(query) {
  return request({
    url: '/sys/winLose/list',
    method: 'get',
    params: query
  })
}

// 查询输赢 总计
export function totalWinLose(query) {
  return request({
    url: '/sys/winLose/total',
    method: 'get',
    params: query
  })
}

// 查询 客户日报表
export function listReport(query) {
  return request({
    url: '/sys/report/list',
    method: 'get',
    params: query
  })
}

//总计 客户日报表
export function totalReport(query) {
  return request({
    url: '/sys/report/total',
    method: 'get',
    params: query
  })
}


// 查询台面上下水报表
export function listTablePlumbing(query) {
  return request({
    url: '/sys/tablePlumbing/list',
    method: 'get',
    params: query
  })
}

//总计台面上下水报表
export function totalTablePlumbing(query) {
  return request({
    url: '/sys/tablePlumbing/total',
    method: 'get',
    params: query
  })
}


// 查询员工录入错账报表
export function listInputError(query) {
  return request({
    url: '/sys/inputError/list',
    method: 'get',
    params: query
  })
}

// 查询荷官上下水报表
export function dealerWaterList(query) {
  return request({
    url: '/sys/dealer/selectDealerStatisticsList',
    method: 'get',
    params: query
  })
}


