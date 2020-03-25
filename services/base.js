// 数据缓存服务
class CacheService {
    constructor(httpClient) {
        this.$http = httpClient
        this.__map = new Map()
    }
    defaultSuccessChecker(data) {
        return data.code === 0
    }
    post(key, url, options, token, successChecker) {
        if (this.__map.has(key)) {
            return Promise.resolve(this.__map.get(key))
        } else {
            return this.$http.post(url, options, token).then(response => response.data).then(data => {
                successChecker = successChecker || this.defaultSuccessChecker
                if (successChecker(data)) {
                    this.__map.set(key, data)
                }
                return Promise.resolve(data)
            })
        }
    }
    get(key, url, options, successChecker) {
        if (this.__map.has(key)) {
            return Promise.resolve(this.__map.get(key))
        } else {
            return this.$http.get(url, options).then(response => response.data).then(data => {
                successChecker = successChecker || this.defaultSuccessChecker
                if (successChecker(data)) {
                    this.__map.set(key, data)
                }
                return Promise.resolve(data)
            })
        }
    }
    delete(key) {
        return this.__map.delete(key)
    }
    clear() {
        return this.__map.clear()
    }
}
// 服务基类
export class BaseService {
    constructor(axios) {
        this.$http = axios
        this.$cache = new CacheService(axios)
    }
    cache(key, url, options, successChecker, appCode) {
        return this.$cache.post(key, url, options, {
            headers: {
                token: this.getToken(),
                appCode: this.getAppCode(appCode)
            }
        }, successChecker)
    }
    deleteCache(key) {
        return this.$cache.delete(key)
    }
    clearCache() {
        this.$cache.clear()
    }
    post(url, options, appCode) {
        return this.$http.post(url, options, {
        }).then(response => response.data).then(data => {
            return Promise.resolve(data)
        })
    }
    get(url, options) {
        return this.$http.get(url, options).then(response => response.data).then(data => {
            return Promise.resolve(data)
        })
    }

}
