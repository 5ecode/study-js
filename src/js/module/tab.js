'use strict';
/*----------------------------------------------------------------------
@tabModule
----------------------------------------------------------------------*/
export class tablModule {
  constructor(stage) {
    this.stage = stage;
    this.trigger = this.stage.querySelectorAll("[data-tabid]");
    this.target = this.stage.querySelectorAll('[data-tab="body"]');
    this.activeClass = "is-active";
  }

  init() {
    for (let i = 0; i < this.trigger.length; i++) {
      this.trigger[i].addEventListener('click', (e) => {
        let currentMenu = e.currentTarget,
          currentContent = document.getElementById(currentMenu.dataset.tabid);

        for (let i = 0; i < this.trigger.length; i++) {
          this.trigger[i].classList.remove(this.activeClass);
          this.target[i].classList.remove(this.activeClass);
        }

        currentMenu.classList.add(this.activeClass);

        if (currentContent !== null) {
          currentContent.classList.add(this.activeClass);
        }
      });
    }
  }
}
