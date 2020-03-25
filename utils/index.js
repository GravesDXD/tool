// import _ from 'lodash';
import { Message } from 'element-ui';
import config from './config';
import store from '../store';

const actions = new WeakMap();

function $import(file) {
  return () => import(`views/${file}`);
}

function doAction(func, ...params) {
  if (!actions.has(func)) {
    actions.set(func, true);
  }
  // 控制异步流程顺序执行，以便捕获异常和函数结束后做通用处理
  async function f() {
    try {
      await store.dispatch('StartLoading');
      await func(...params);
      setTimeout(() => store.dispatch('EndLoading'));
    } catch (error) {
      Message({
        message: '调用后台服务错误',
        type: 'error',
      });
      store.dispatch('EndLoading');
    }
  }
  if (actions.get(func)) {
    actions.set(func, false);
    setTimeout(() => actions.set(func, true), config.ACTION_INTERVAL);
    f();
  }
}

function uuid() {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  return s.join('');
}

/*
*校验电话号码是否合法
*/
function validatePhone(phone) {
  phone = phone.replace(/\s+/g, "");
  const phoneReg = "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9])|(17[0-9])|(19[0-9]))\\d{8}$";
  const r = phone.match(phoneReg);
  return r;
}

/*
*校验座机号码.
*/
function validateTel(tel) {
  tel = tel.replace(/\s+/g, "");
  const telReg = /^0\d{2,3}-?\d{7,8}$/;
  const r = tel.match(telReg);
  return r;
}

/*
*身份证ID.
*/
function validateIC(ic) {
  if (ic) {
    if (ic.length === 15) {
      const regIc = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      const r = ic.match(regIc);
      return r;
    } else if (ic.length === 18) {
      let regIc = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      const r = ic.match(regIc);
      return r;
    }
  } else {
    return false;
  }
}

function validatePwd(pwd) {
  pwd = pwd.replace(/\s+/g, "");
  const pwdReg = /^[A-Za-z0-9]{8,20}$/;
  const r = pwd.match(pwdReg);
  return r;
}

function validateCaptcha(captcha) {
  captcha = captcha.replace(/\s+/g, "");
  const pwdReg = /^[0-9]{6}$/;
  const r = captcha.match(pwdReg);
  return r;
}

function validateName(name) {
  name = name.replace(/\s+/g, "");
  const pwdReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{2,19}$/;
  const r = name.match(pwdReg);
  return r;
}

function deepCopy(obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  var newobj = {};
  if (obj instanceof Array) {
    newobj = [];
  }
  for (var attr in obj) {
    if (obj[attr] !== null) {
      newobj[attr] = deepCopy(obj[attr]);
    }
  }
  return newobj;
}
function GetCharLength(str) {
  let iLength = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      iLength += 2;
    } else {
      iLength += 1;
    }
  }
  return iLength;
}

//Convert filter to methods.
function toRMB(s) {
  if (!s) return '0.00' + "元"
  // 人民币显示样式
  if (/[^0-9\.]/.test(s)) return s;
  s += ''
  s = s.replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  let re = /(\d)(\d{3},)/;
  while (re.test(s))
    s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  // return "￥" + s.replace(/^\./,"0.")
  return s.replace(/^\./, "0.") + "元";
}

//Convert filter to methods.
function toRMBSimple(s) {
  if (!s) return '0.00';
  // 人民币显示样式
  if (/[^0-9\.]/.test(s)) return s;
  s += ''
  s = s.replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  let re = /(\d)(\d{3},)/;
  while (re.test(s))
    s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  // return "￥" + s.replace(/^\./,"0.")
  return s.replace(/^\./, "0.");
}

export {
  config,
  $import,
  uuid,
  validatePhone,
  validateTel,
  validateIC,
  validatePwd,
  doAction,
  deepCopy,
  GetCharLength,
  toRMB,
  toRMBSimple
};
