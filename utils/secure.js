import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import { getToken } from '@/utils/auth'; // 验权
import StorageUtil from '@/utils/storageUtil';
import { getUserPermissions } from '@/api/user';

// permissiom judge
function hasPermission(permissions, path) {
  for (let pp of permissions) {
    if (path.indexOf(pp) > -1) {
      return true;
    }
  }
  return false;
}

// register global progress.
const whiteList = ['/applyPurchase/defeatedImp', '/login', '/home', '/retrievePwd', '/resetBasePwd', '/goods', '/searchResults', '/register', '/supplierRegister', '/authoried', '/401', '/403', '/404', '/annDetail', '/homeResultList', '/homePurchaseList', '/hospitalWorkBench', '/supplierWorkBench']; // 不重定向白名单顶级页

// 阻止浏览器后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
  history.pushState(null, null, document.URL);
});

router.beforeEach(async (to, from, next) => {
  // debugger;
  if (from.meta.isBack) {
    StorageUtil.setItem("fromPath", from.fullPath);
  }
  NProgress.start(); // 开启Progress
  // to.path.sup
  let arr = to.path.split("/");
  let eq = arr.length >= 2 ? "/" + arr[1] : to.path;
  if (whiteList.indexOf(eq) !== -1) { // 在免登录白名单，直接进入
    next();
  } else if (getToken()) { // 判断是否有token, 已登录
    if (to.path === '/login') { // 请求页面为login则进入首页
      next({ path: '/' });
    } else {
      // 其他页面
      if (!store.getters.permissions) { // 如果还没有加载用户权限，加载...
        try {
          await store.dispatch('permission/GetUserPermissions'); // 获取用户权限
          await store.dispatch('permission/GenerateRoutes'); // 生成可访问的路由表
          router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
          next({ ...to }); // 加载动态路由后需重新访问一次原url，确保动态加载成功
        } catch (error) {
          // 获取权限失败强制登出返回登录页
          // TODO: 提示消息
          await store.dispatch('FedLogOut');
          next({ path: '/login' });
        }
      } else {
        // 权限检查
        if (hasPermission(store.getters.permitedPaths, to.path)) {
          next();
        } else {
          // 再次从后端请求权限，判断是否有权限。有可能用户认证刚通过，未刷新页面，点报价情况。
          getUserPermissions().then(async (res) => {
            const { status, result, msg } = res.data;
            if (status === 1 && result) {
              if (hasPermission(result.map(r => r.url), to.path)) {
                next();
              } else {
                next({ path: '/403', query: { noGoBack: true } });
              }
            } else {
              console.error(msg)
              // 获取权限失败强制登出返回登录页
              // TODO: 提示消息
              await store.dispatch('FedLogOut');
              next({ path: '/login' });
            }
          }, async (err) => {
            // 获取权限失败强制登出返回登录页
            // TODO: 提示消息
            console.error(err)
            await store.dispatch('FedLogOut');
            next({ path: '/login' });
          })
        }
      }
    }
  } else {
    next({ path: '/login' });
    NProgress.done(); // 结束Progress
  }

  // let allowBack = true    //    给个默认值true
  // if (to.meta.allowBack !== undefined) {
  //   allowBack = to.meta.allowBack
  // }
  // if (!allowBack) {
  //   history.pushState(null, null, location.href)
  // }
  // store.dispatch('updateAppSetting', {
  //   allowBack: allowBack
  // })
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
