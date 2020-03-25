import Cookies from 'js-cookie';
import StorageUtil from '@/utils/storageUtil';
import { asyncRouterMap } from '@/router';


const TokenKey = 'Authorization';
const PermittedPathKey = 'PermittedPathes';

export function getToken() {
  return StorageUtil.getItem(TokenKey);
}

export function setToken(token) {
  return StorageUtil.setItem(TokenKey, token);
}

export function removeToken() {
  return StorageUtil.removeItem(TokenKey);
}

export function getCookie(key) {
  return Cookies.get(key);
}

export function setPermittedPathes(PermittedPathes) {
  return StorageUtil.setItem(PermittedPathKey, JSON.stringify(PermittedPathes));
}

export function getPermittedPathes() {
  if (StorageUtil.getItem(PermittedPathKey)) {
    return JSON.parse(StorageUtil.getItem(PermittedPathKey));
  }

}

export function removePermittedPathes() {
  StorageUtil.removeItem("supplierData");
  return StorageUtil.removeItem(PermittedPathKey);
}

function hasPermission(paths, path) {
  return paths.indexOf(path) > -1;
}

export function filterAsyncRouter(asyncRouters, paths) {
  let routers = []
  for (let ar of asyncRouters) {
    let arc = JSON.parse(JSON.stringify(ar))
    if (ar.components) {
      arc.components = ar.components;
    }
    if (ar.component) {
      arc.component = ar.component;
    }
    if (ar.children) {
      arc.children = ar.children;
    }
    routers.push(arc)
  }
  const accessedRouters = routers.filter((route) => {
    const path = route.path;
    if (route.defaultShow || hasPermission(paths, path)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, paths);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

function getPermittedRouters(permittedPathes) {
  return filterAsyncRouter(asyncRouterMap, permittedPathes);
}

export function initPermissions(router, store) {
  let permittedPathes = getPermittedPathes();
  if (permittedPathes) {
    let routes = getPermittedRouters(permittedPathes);
    store.commit('permission/SET_ROUTERS', routes);
    router.addRoutes(routes);
  }
}
