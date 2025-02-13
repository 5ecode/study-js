
'use strict';
/*----------------------------------------------------------------------
@ResizeManagerクラス
----------------------------------------------------------------------*/
export class ResizeManager {
  constructor(target, action) {
    this.target = target;
    this.action = action;
  };
  resize() {
    let timer,
        lastInnerWidth = window.innerWidth;
    window.addEventListener("resize", () => {

      if (timer) return;
      timer = setTimeout(() => {
        if (lastInnerWidth != window.innerWidth) {
          timer = 0;
          this.action();
          lastInnerWidth = window.innerWidth;
        }
      }, 500);
    });
  }
};

/*----------------------------------------------------------------------
@FadeAnimationクラス
----------------------------------------------------------------------*/
export class FadeAnimation {
  constructor(target) {
    this.target = target;
  };
  init() {
    this.target.style.opacity = 0;
  }
  fadeOut(delay = 100) {
    this.target.classList.remove('u-fadeIn');
    this.target.classList.add('u-fadeOut');
    var target = this.target;
    setTimeout(function(){
      target.style.display = 'none'
      target.classList.remove('u-fadeOut');
    }, delay);
  }
  fadeIn(delay = 100) {
    this.target.style.display = 'block'
    var target = this.target;
    setTimeout(function(){
      target.classList.add('u-fadeIn');
    }, delay);
  }
}
