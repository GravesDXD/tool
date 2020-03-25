/**
 * Created by renzhs on 2017/6/26.
 * 用于存储前端的数据
 * 基于key-value模式
 * 前端存储的统一接口
 */
var localStorageUtil={
    _storage:null,
    setItem:function(key,value){
        this. _storage.setItem(key,value);
    },
    getItem:function(key){
        return  this._storage.getItem(key);
    },
    removeItem:function(key){
        this._storage.removeItem(key);
    },
    clear:function(){
        this._storage.clear();
    }
};

if(window.localStorage){
    localStorageUtil._storage=window.localStorage;
}else{
    localStorageUtil._storage=window.sessionStorage;
}

export default localStorageUtil;
