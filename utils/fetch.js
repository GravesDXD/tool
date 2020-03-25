import axios from 'axios';
import { Message } from 'element-ui';
// import store from '@/store';
import { getToken } from '@/utils/auth';
import { getBaseUrl } from '@/utils/api';
import { uuid as getUUId } from '@/utils';
import { removeToken, removePermittedPathes } from "@/utils/auth";
import { getEnterprise, removeEnterprise } from "@/utils/enterprise";
import { getUser, removeUser } from "@/utils/user";
// 创建axios实例
const service = axios.create({
  baseURL: getBaseUrl(), // api的base_url
  // timeout: 5000,         // 请求超时时间
  timeout: 60 * 1000,
});

// request拦截器
service.interceptors.request.use((config) => {
  // 每个请求增加token信息
  const token = getToken();
  if (token) {
    const uuid = getUUId();
    config.headers['Authorization'] = token;
    config.headers['X-Trace-ID'] = uuid;
    // header("Access-Control-Allow-Methods:POST");
    // header("Access-Control-Allow-Headers:x-requested-with,content-type");
  }
  if (config.data) {
    let dStr = JSON.stringify(config.data);
    if (dStr) {
      config.data = JSON.parse(dStr.replace(/\s+\"/g, '"').replace(/\"\s+/g, '"'))
    }
  }
  if (config.params) {
    let pStr = JSON.stringify(config.params);
    if (pStr) {
      config.params = JSON.parse(pStr.replace(/\s+\"/g, '"').replace(/\"\s+/g, '"'))
    }
  }

  if (config.method == 'get' || config.method == 'GET') {
    if (!config.params) {
      config.params = {}
    }
    config.params['nowT'] = new Date().getTime(); // 解决IE GET方法缓存问题
  }
  return config;
}, (error) => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  (response) => {
    // debugger
    if (response.data && response.data.status == -1 && (response.data.code == '1001')) {
      window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
      window.GLOBAL_VUE_INSTANCE.$router.replace('/login');
      return new Promise(() => { window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading'); });
    } else if (response.data && response.data.status == -1 && (response.data.code === '2017')) {
      window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
      window.GLOBAL_VUE_INSTANCE.$router.replace('/login');
      return new Promise(() => {
        window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading'); window.GLOBAL_VUE_INSTANCE.$message({
          message: '该账号已经被禁用，请联系系统管理员',
          type: 'warning'
        });
      });
    } else if (response.data && response.data.status == -1 && (response.data.code === '2018')) {
      window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
      window.GLOBAL_VUE_INSTANCE.$router.replace('/login');
      return new Promise(() => {
        window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading'); window.GLOBAL_VUE_INSTANCE.$message({
          message: '该账号已经被删除，请联系系统管理员',
          type: 'warning'
        });
      });
    }
    else if (response.data && response.data.status == -1 && (response.data.flag === 'reset')) {
      window.GLOBAL_VUE_INSTANCE.$router.replace('/retrievePwd');
      return new Promise(() => { window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading'); });
    } else if (response.data && response.data.status == -1 && (response.data.code === '9002')) {
      return new Promise(() => {
        window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
        window.GLOBAL_VUE_INSTANCE.$alert(
          "用户状态变更，请重新登录！",
          "提示",
          {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {
              window.GLOBAL_VUE_INSTANCE.$router.replace("/login");
              removeToken();
              removeEnterprise();
              removeUser();
              removePermittedPathes();
            }
          }
        );
      });
    } else if (response.data && response.data.status == -1 && (response.data.code === '0000' || response.data.code === '0001')) {
      window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
      let msg = '网络请求出错，请稍后重试';
      Message({
        message: msg,
        type: 'warning',
        duration: 3 * 1000,
      });
      return new Promise(() => { });
    }
    else {
      return response;
    }
  },
  (error) => {
    window.GLOBAL_VUE_INSTANCE.$store.dispatch('EndLoading');
    let msg = error.message == 'Network Error' ? '网络请求出错，请检查网络后重试' : "网络异常";
    if (msg.indexOf('timeout of ') == 0) {
      msg = '网络请求超时！';
    }
    Message({
      message: msg,
      type: 'error',
      duration: 3 * 1000,
    });
    return new Promise(() => { });
  },
);

export default service;
