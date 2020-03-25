import axios from 'axios'
import { BaseService } from './base.js'


const urls = Object.freeze({
    getUsersList: 'https://xxx', //获取参加活动的用户信息
    startAct: 'https://xxx', //开始活动
    getShakeUserList: 'https://xxx', 
    getRankResult: 'https://xxx',  
    checkActState: 'https://xxx',  
    setUserCount: 'https://xxx' 
})

class ActiveService extends BaseService {
    /**
     * 获取用户信息
     * @param options
     * @returns {Promise<T>}
     */
    getUsersList (options) {
        return this.get(urls.getUsersList, options).then(response => response)
    }

    /**
     * 开始
     * @param options
     * @returns {Promise<T>}
     */
    startAct (options) {
        return this.get(urls.startAct, options).then(response => response)
    }

    /**
     * 活动期间的前10名
     * @param options
     * @returns {Promise<T>}
     */
    getShakeUserList (options) {
        return this.get(urls.getShakeUserList, options).then(response => response)
    }

    /**
     * 获取当前用户的中奖结果和前十名的名单
     * @param options
     * @returns {Promise<T>}
     */
    getRankResult (options) {
        return this.get(urls.getRankResult, options).then(response => response)
    }

    /**
     * 获取活动状态
     * @param options
     * @returns {Promise<T>}
     */
    checkActState (options) {
        return this.get(urls.checkActState, options).then(response => response)
    }

    /**
     * 上传用户要手机数据
     * @param options
     * @returns {Promise<T>}
     */
    setUserCount (options) {
        return this.get(urls.setUserCount, options).then(response => response)
    }


}

export default new ActiveService(axios)