/**
 *  ############################## 文档说明 ##############################
 *  执行者: 组件A , 组件B
 *  使用背景:   当 组件A 执行操作时，需要修改/触发 组件B 的属性或方法.
 *  使用方式: 
 *      步骤-1: 组件A 中引入EventBus.js文件 ==> 
 *          import {EventBus} from "@/utils/event-bus";
 * 
 *      步骤-2: 在 组件A 的methods内某一个方法内注册事件 ==> 
 *           EventBus.$emit('your-event-name');
 * 
 *      步骤-3: 在 组件B 中引入EventBus.js文件 ==> 
 *          import {EventBus} from "@/utils/event-bus";
 * 
 *      步骤-4: 在 组件B 的生命周期函数中监听并执行已注册的事件 ==> 
 *          EventBus.$on('your-event-name',()=>{
                this.xxxx = "";
            });
        
        步骤-5: 在 生命周期的beforeDestroy函数中移除该事件 ==> 
            beforeDestroy() {
                EventBus.$off('your-event-name');
            },

    详情请参照:
           src\components\headers\tabs\src\homeTabs.vue
           src\components\headers\search\src\searchHeader.vue
 */
import Vue from 'vue';
export const EventBus = new Vue();
