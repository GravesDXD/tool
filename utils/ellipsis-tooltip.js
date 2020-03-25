import popover from 'element-ui/packages/popover'
import Vue from 'vue';

let menter, mout, instance;

const tooltip = {
  bind: function (el, binding) {
    function _init() {
      const Popover = Vue.extend(popover);
      const defaultOpts = {
        width: 200,
        placement: "bottom",
        trigger:"hover",
      };

      instance = new Popover({
        el: document.createElement('div')
      });
      Object.assign(instance, defaultOpts, binding.value);
      document.body.appendChild(instance.$el);
    };
    function mouseenterHandler(el){
      return function(){
        const contentWidth = el.scrollWidth;
        const containerWidth = el.offsetWidth;
        if (contentWidth > containerWidth) {
          instance || _init();
          instance.reference = instance.referenceElm = el;
          instance.content = el.innerText;
          instance.value = true;
        }
      }
    };
    function mouseleaveHandler(){
      return function(){
        debugger;
        instance && (instance.value = false);
      }
    };

    menter = mouseenterHandler(el);
    mout = mouseleaveHandler();

    el.addEventListener('mouseenter', menter);
    el.addEventListener('mouseleave',mout);

  },
  unbind(el, bindings) {
    el.removeEventListener('mouseenter',menter);
    el.removeEventListener('mouseleave',mout);
  }
}

tooltip.install = function() {
  Vue.directive('ellipsis-tooltip', tooltip);
}

export default tooltip;
