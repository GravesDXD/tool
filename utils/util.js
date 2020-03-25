/**
 * 对饿了吗级联下拉组件方法的扩展,通过选中的级联数组值（value）去获取对应的label数组值
 * @param {*} value 选中的级联value值数组
 * @param {*} list 级联层级数组
 * @param {*} index 递归次数
 */
export function getLabel(value, list, index) {
  list.find(function (item) {
    if (item.value === value[index]) {
      value[index] = item.label;
      if (item.children && item.children.length > 0) {
        index++;
        getLabel(value, item.children, index);
      }
    }
  });
}
/**
 * 根据普通下拉框value获取对应的label
 * @param {*} value
 * @param {*} list
 */
export function getSelectedLabel(value, list) {
  let targetLabel = "";
  list.forEach(element => {
    if (element.value === value) {
      targetLabel = element.label;
    }
  });
  return targetLabel;

}
/**
 * 获取第二天某个时间点
 * @param {*} time 当前时间，new Date()
 * @param {*} day 天数，number
 * @param {*} hms 第二天的时间点，string，格式：时分秒，比如12:00:00
 */
export function GetNextDate(time, day, hms) {
  //获取当前时间年月日
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var t = y + "-" + m + "-" + d + " " + hms;
  var tDate = new Date(Date.parse(t.replace(/-/g, "/")));
  tDate = +tDate + day * 24 * 60 * 60 * 1000;
  tDate = new Date(tDate);
  return tDate;
}
/**
 * 时间格式转换 YYY-MM-DD hh:mm:ss
 * @param {*} date
 */
export function formatDate(date) {
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth()) + "-";
  let D =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
/**
 * 时间格式转换 YYY-MM-DD
 * @param {*} date
 */
export function formatDateWithoutHour(date) {
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() < 10 ? "0" + parseInt(parseInt(date.getMonth()) + 1) : parseInt(parseInt(date.getMonth()) + 1)) + "-";
  let D =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  return Y + M + D;
}

//格式化金额,s金额，n小数点位数
export function formatMoney(s, n) {
  if ((!s && s!= 0)||s.length == 0){
      return '';
  }
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  let l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1];
  let t = "";
  for(let i = 0; i < l.length; i ++ )
  {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}
//反格式化金额
export function reFormatMoney(s) {
  if (!s){
    return '';
  }
  return Number(s.toString().replace(/,/gi, ""));
}
