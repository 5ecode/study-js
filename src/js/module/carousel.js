'use strict';
import { ResizeManager } from './module';

/*----------------------------------------------------------------------
@CarouselModule
----------------------------------------------------------------------*/
export class CarouselModule {
  constructor(target) {
    this.target = target;
    this.elName = this.target.dataset.slide;
    this.move = this.target.getElementsByClassName(this.elName + '_move')[0];
    this.item = this.target.getElementsByClassName(this.elName + '_item');
    this.itemLength = this.item.length;
    this.current = 0;
    this.count = 0;
    this.countMax = this.itemLength - 1;
    this.pointerCount = 0;
    this.moving = false;
    this.self = this;
    this.duration = 5000;
    this.delay = 500,
    this.autoID = undefined;
    this.animeEasing = 'is-moving';
    this.currentClass = 'is-current';
    this.showClass = 'is-show';
    this.inactiveClass = 'is-inactive';
    this.control = null;
    this.pointerType = 'dot';
    this.loop = false;
    this.fade = false;
    this.auto = false;
    this.shiftSetFade = false;
  }

  init() {
    if (this.loop && !this.fade) {
      this.loopCreateClone();
    }

    this.setting();

    if (this.auto) {
      setTimeout(() => {
        this.autoPlay();
      }, this.duration);
    }

    const responsive = new ResizeManager(this,this.resize);
    responsive.resize();
  }

  // 数値設定
  setting() {
    if (this.fade) {
      this.target.dataset.type = 'fade';
      this.itemWidth = this.target.clientWidth;
      this.item[this.count].classList.add(this.showClass);
      for (let i = 0; i < this.itemLength; i++) {
        this.moveSize = (this.itemWidth * i) * -1;
        this.item[i].style.transform = "translateX(" + this.moveSize + "px)";
      }
    } else {
      this.itemWidth = this.target.clientWidth;
      const initialPosi = this.itemWidth * -this.count;
      this.moveSizeMax = this.itemWidth * -this.countMax;
      this.move.style.transform = "translateX(" + initialPosi + "px)";
      this.currentPosi = initialPosi;
    }
  } //setting

  //先頭と最後尾のアイテムをクローン
  loopCreateClone() {
    const cloneFirst = this.move.firstElementChild.cloneNode(true),
    cloneLast = this.move.lastElementChild.cloneNode(true);
    this.move.insertBefore(cloneLast, this.move.firstChild);
    this.move.appendChild(cloneFirst);
    this.count = 1;
    this.pointerCount = 1;
    this.countMax = this.itemLength;
  }

  // エリア生成
  createControlArea() {
    if (this.target.querySelector('.' + this.elName + '_control') === null) {
      const elementControlArea = document.createElement('div');
      elementControlArea.className = this.elName + '_control';
      this.target.appendChild(elementControlArea);
      this.control = this.target.getElementsByClassName(this.elName + '_control')[0];
    }
  }

  // 送りボタン生成
  createShiftBtn() {
    this.createControlArea();
    for (let i = 0; i < 2; i++) {
      var btn = document.createElement('buttom');
      if (i === 0) {
        btn.className = this.elName + '_shiftBtn _prev';
        this.control.appendChild(btn);
      } else {
        btn.className = this.elName + '_shiftBtn _next';
        this.control.appendChild(btn);
      }
    }
    this.shiftBtn = this.target.getElementsByClassName(this.elName + '_shiftBtn');

    this.shiftEvent();
  } //createShiftBtn

  // 送りボタンイベント
  shiftEvent() {
    for (var i = 0; i < this.shiftBtn.length; i++) {
      this.shiftBtn[i].addEventListener('click', (e) => {
        if (!this.moving) {
          this.moving = true;
          if (e.target.classList.contains('_prev')) {
            this.count--;
          } else {
            this.count++;
          }
          this.currentPlace();
        }
      });
    }
  } //shiftEvent

  // 送りボタン表示切替
  shiftBtnToggle() {
    if (!this.loop && this.shiftBtn) {
      if (this.count <= 0) {
        this.shiftBtn[0].classList.add(this.inactiveClass);
      } else {
        this.shiftBtn[0].classList.remove(this.inactiveClass);
      }
      if (this.count >= this.countMax) {
        this.shiftBtn[1].classList.add(this.inactiveClass);
      } else {
        this.shiftBtn[1].classList.remove(this.inactiveClass);
      }
    }
  }

  // ポインター生成
  createPointer() {
    this.createControlArea();
    const pointerWrap = document.createElement('div'),
      pointerClass = this.elName + '_pointer';

    pointerWrap.className = pointerClass;
    for (let i = 0; i < this.itemLength; i++) {
      const point = document.createElement('buttom');

      if (this.pointerType === 'num') {
        point.className = this.elName + '_num';
        point.innerHTML = i + 1;
      } else {
        point.className = this.elName + '_dot';
      }

      if (i == this.current) {
        point.classList.add(this.currentClass);
        pointerWrap.appendChild(point);
      } else {
        pointerWrap.appendChild(point);
      }
    }

    this.control.appendChild(pointerWrap);
    this.pointer = this.target.getElementsByClassName(pointerClass)[0];
    this.point = this.pointer.getElementsByTagName('buttom');
    this.pointerEvent();
  } //createPointer

  // ポインターイベント
  pointerEvent() {
    for (let i = 0; i < this.point.length; i++) {
      this.point[i].addEventListener('click', (e) => {
        if (!this.moving) {
          this.moving = true;
          let index = Array.prototype.indexOf.call(this.point, e.currentTarget);
          this.count = index + this.pointerCount;
          this.currentPlace();
        }
      });
    }
  }//pagerEvent

  // 現在値を調べる
  currentCheck() {
    if (this.fade && this.loop) {
      if (this.count > this.countMax) {
        this.count = 0;
      } else if (this.count < 0) {
        this.count = this.countMax;
      }
      this.current = this.count;
    } else if (this.loop) {
      this.current = this.count - 1;
      if (this.current >= this.countMax) {
        this.current = 0;
      } else if (this.current < 0) {
        this.current = this.countMax - 1;
      }
    } else {
      if(0 > this.count){
        this.count = 0;
      } else if (this.count >= this.countMax) {
        this.count = this.countMax;
      }
      this.current = this.count;
    }
  }

  // 現在地表示
  currentPointer(active) {
    if (!this.pointer) return false;
    for (let i = 0; i < this.point.length; i++) {
      if (this.point[i].classList.contains(this.currentClass)) {
        this.point[i].classList.remove(this.currentClass);
      }
    }
    this.point[active].classList.add(this.currentClass);
  }

  // 現在地
  currentPlace() {
    this.currentCheck();
    this.shiftBtnToggle();
    this.currentPointer(this.current);
    this.lateralMotion();
  } //currentPlace

  //フリックイベント
  flickEvent() {
    let isTouchDevice = null,
      isTouching = false,
      startX = 0,
      movedX = 0,
      slideX = 0,
      rangeX = 0;

    const touchEvent = window.ontouchstart,
      touchPoints = navigator.maxTouchPoints;

    if (touchEvent !== undefined && 0 < touchPoints) {
      isTouchDevice = true;
    } else {
      isTouchDevice = false;
    }

    const linkElements = this.move.querySelectorAll('a'),
      _self = this;

    window.addEventListener('load', () => {
      if (isTouchDevice) {
        this.move.addEventListener('touchstart', logSwipeStart);
        this.move.addEventListener('touchmove', logSwipeMove);
        this.move.addEventListener('touchend', logSwipeEnd);
      } else {
        this.move.addEventListener('mousedown', logSwipeStart);
        this.move.addEventListener('mousemove', logSwipeMove);
        this.move.addEventListener('mouseout', logSwipeOut);
        this.move.addEventListener('mouseup', logSwipeEnd);
      }
    });

    function linkCancel(e) {
      e.preventDefault();
    }

    function logSwipeStart(event) {
      clearTimeout(_self.autoID);
      if (!isTouchDevice) {
        event.preventDefault();
        linkElements.forEach((e) => {
          e.addEventListener('click', linkCancel, false);
        });
      }
      startX = (isTouchDevice ? event.touches[0].pageX : event.pageX);
      isTouching = true;
    }

    function logSwipeMove(event) {
      if (isTouching === true) {
        movedX = (isTouchDevice ? event.touches[0].pageX : event.pageX);
        slideX = Math.round(startX - movedX);
        rangeX = _self.currentPosi - (slideX);

        _self.move.style.transform = "translateX(" + rangeX + "px)";
      }
    }

    function logSwipeOut() {
      if (!isTouching) return;
      document.onmouseup = () => {
        _self.move.style.transform = "translateX(" + _self.currentPosi + "px)";
      }
      isTouching = false;
    }

    function logSwipeEnd() {
      if (!isTouching) return;
      isTouching = false;

      if (!isTouchDevice && Math.abs(slideX) === 0) {
        linkElements.forEach((e) => {
          e.removeEventListener('click', linkCancel, false);
        });
      } else if (Math.abs(slideX) > 0 && 50 > Math.abs(slideX)) {
        _self.move.style.transform = "translateX(" + _self.currentPosi + "px)";
        _self.move.classList.remove(_self.animeEasing);
      } else if (Math.abs(slideX) >= 50) {
        if (0 < (movedX - startX)) {
          _self.count--;
          _self.currentPlace();
        } else {
          _self.count++;
          _self.currentPlace();
        }
      }
      slideX = 0;
    }
  } //flickEvent

  //横移動
  lateralMotion() {
    if (this.auto) clearTimeout(this.autoID);
    this.move.classList.add(this.animeEasing);
    let moving = (this.itemWidth * this.count) * -1;
    this.move.style.transform = "translateX(" + moving + "px)";
    this.currentPosi = moving;
    setTimeout(() => {
      this.move.classList.remove(this.animeEasing);

      if (this.loop) {
        if (this.count >= this.countMax + 1) {
          let startSize = this.itemWidth * -1;
          this.count = 1;
          this.move.style.transform = 'translateX(' + startSize + 'px)';
          this.currentPosi = startSize;
        } else if (this.count <= 0) {
          this.count = this.countMax;
          this.move.style.transform = 'translateX(' + this.moveSizeMax + 'px)';
          this.currentPosi = this.moveSizeMax;
        }
      }

      this.moving = false;
      if (this.auto) this.autoPlay();
    }, this.delay);
  }

  // フェードアニメーション
  fadeMotion() {
    if (this.auto) clearTimeout(this.autoID);

    for (var i = 0; i <= this.countMax; i++) {
      if (this.item[i].classList.contains(this.showClass)) {
        this.item[i].classList.remove(this.showClass);
      }
    }

    this.item[this.count].classList.add(this.showClass);
    setTimeout(() => {
      this.moving = false;
      if (this.auto) this.autoPlay();
    }, this.delay);
  }

  // 自動送り
  autoPlay() {
    this.autoID = setTimeout(() => {
      this.count++;
      this.currentPlace();
    }, this.duration);
  } //autoPlay

  // リサイズ
  resize() {
    this.target.setting();
  } //resize
}

/*----------------------------------------------------------------------
@片道スライド
----------------------------------------------------------------------*/
class OneSideSlide extends CarouselModule{
  constructor(target) {
    super(target);
  }

  init() {
    super.init();
    super.createShiftBtn();
    super.createPointer();
    super.flickEvent();
    super.currentPlace();
  }
}

/*----------------------------------------------------------------------
@ループスライド
----------------------------------------------------------------------*/
class LoopSlide extends CarouselModule{
  constructor(target) {
    super(target);
    this.loop = true;
    this.auto = true;
  }

  init () {
    super.init();
    super.createShiftBtn();
    super.createPointer();
    super.flickEvent();
  }
}

/*----------------------------------------------------------------------
@クロスフェードスライド
----------------------------------------------------------------------*/
class LoopCrossFade extends CarouselModule {
  constructor(target) {
    super(target);
    this.fade = true;
    this.loop = true;
    this.auto = true;
    this.duration = 6000;
  }

  init() {
    super.init();
    super.createPointer();
  }

  // 現在地
  currentPlace() {
    this.currentCheck();
    this.currentPointer(this.current);
    this.fadeMotion();
  } //currentPlace
}

export { LoopSlide, OneSideSlide, LoopCrossFade };