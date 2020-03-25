export function getBaseUrl() {
  // 多套环境公用，配置服务器ip到jenkins挂载文件，server.js
  if (window && window.server) {
    return window.server;
  }
  return '/epro';
}

export default {
  getBaseUrl,
};