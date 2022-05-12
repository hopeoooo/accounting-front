/*
 * @Author:
 * @Date: 2021-12-10 15:56:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-12 14:58:03
 * @Description: file content
 */
// vue定义全局过滤器

// 金额保留两位小数，超过两位的直接截取掉
// 例如12.128直接显示为12.12）
// （带两位小数，0不用写成0.00)
const MoneyFormat = value => {
  // debugger
  if (value == 0) return 0;
  if (!value) return "0.00";
  /* 原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正 */
  var intPart = Math.floor(value); // 获取整数部分
  var intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
  var floatPart = ".00"; // 预定义小数部分
  var value2Array = intPartFormat.split(".");
  //= 2表示数据有小数位
  if (value2Array.length === 2) {
      floatPart = value2Array[1].toString(); // 拿到小数部分
      if (floatPart.length === 1) {
          // 补0,实际上用不着
          return intPartFormat + "0";
      } else {
          return intPartFormat;
      }
  } else {
      return intPartFormat + floatPart;
  }
};

const timeFilter = function(value) {
  return value + "22";
};

const uppcaseFormatter = function(value) {
  // 将文本转换成只有首字母大写
  let lowText = value.toLowerCase();
  return lowText.replace(lowText.charAt(0), lowText.charAt(0).toUpperCase());
};

const allUppcaseFormatter = function(value) {
  // 将文本转换成全部大写
  const result = value.toUpperCase();
  return result;
};

const lowercaseFormatter = function(value) {
  // 将文本转换成只有小写
  let lowText = value.toLowerCase();
  return lowText;
};

export {
  MoneyFormat,
  timeFilter,
  uppcaseFormatter,
  allUppcaseFormatter,
  lowercaseFormatter
};
