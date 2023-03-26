'use strict';
/*----------------------------------------------------------------------
@observerModule
----------------------------------------------------------------------*/
export class observerModule {
  constructor(stage) {
    this.stage = stage;
    this.targets = Array.from(this.stage.querySelectorAll(".u-appear"));
    this.showClass = "is-show";
  }
  init() {
    const options = {
      root: null,
      rootMargin: "-30% 0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(this.callback.bind(this), options);
    this.targets.forEach(function(cont) {
      // 監視の開始
      observer.observe(cont);
    });
  }

  callback(entries, object) {
    entries.forEach(function(entry) {
      // 交差していない
      if (!entry.isIntersecting) return;

      // ターゲット要素
      const cont = entry.target;

      cont.classList.add(this.showClass);

      // 監視の解除
      object.unobserve(cont);
    }.bind(this));
  };
}