'use strict';
/*----------------------------------------------------------------------
@ToggleModule
----------------------------------------------------------------------*/
export class ToggleModule {
  constructor(stage) {
    this.stage = stage;
    this.targets = this.stage.querySelectorAll('details');
    this.triggers = this.stage.querySelectorAll('summary');
    this.activeElm = null;
    this.activeClass = 'is-active';
  }

  // デフォルトチェック
  setting() {
    this.targets.forEach((target) => {
      if (target.open) target.classList.add(this.activeClass);
    });
  }

  // ひとつずつ表示
  oneEach() {
    this.targets.forEach(function(target){
      target.addEventListener('toggle', e => {
        if (e.target.open) {
          if (this.activeElm !== null) this.activeElm.open = false;
          this.activeElm = e.target;
        } else {
          if (this.activeElm === e.target) this.activeElm = null;
        }
      });
    }.bind(this));
  }

  // 折り畳み表示
  folding() {
    this.setting();
    for (let i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', (e) => {
        let thisParent = e.target.parentNode;
        if (thisParent.open) {
          e.preventDefault();
          thisParent.classList.remove(this.activeClass);
          setTimeout(() => {
            thisParent.open = false;
          }, 150);
        } else {
          setTimeout(() => {
            thisParent.classList.add(this.activeClass);
          }, 150);
        }
      });
    }
  }

  // ひとつずつ折り畳み
  oneEachFolding() {
    this.setting();
    for (let i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', (e) => {
        let thisParent = e.target.parentNode;
        if (thisParent.open) {
          e.preventDefault();
          thisParent.classList.remove(this.activeClass);
          setTimeout(() => {
            thisParent.open = false;
          }, 150);
        } else {
          this.targets.forEach((target) => {
            if (target.open) {
              target.classList.remove(this.activeClass);
              setTimeout(() => {
                target.open = false;
              }, 150);
            }
          });
          setTimeout(() => {
            thisParent.classList.add(this.activeClass);
          }, 50);
        }
      });
    }
  }
};

