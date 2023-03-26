'use strict';
import { FadeAnimation } from './module';

/*----------------------------------------------------------------------
@modalModule
----------------------------------------------------------------------*/
export class modalModule {
  constructor() {
    this.trigger = document.querySelectorAll('[data-trigger="modal"]');
    this.activeClass = 'is-active';
    this.fixedClass = 'is-fixed';
    this.largeClass = 'is-lgSize';
    this.open = false;
    this.large = false;
  }

  init() {
    this.createOverlay();
    this.triggerEvent();
  }

  createOverlay() {
    const createElement = '<div id="modalWindow" class="st-modalOverlay" data-modal="close"></div>';
    document.body.insertAdjacentHTML('beforeend', createElement);
    this.modalOverlay = document.getElementById('modalWindow');
    this.close = document.querySelectorAll('[data-modal]');
    this.layerFade = new FadeAnimation(this.modalOverlay);
  }

  triggerEvent() {
    for (let i = 0; i < this.trigger.length; i++) {
      this.trigger[i].addEventListener('click', (e) => {
        let panelId = e.target.getAttribute('aria-controls');
        this.targetPanelId = document.getElementById(panelId);
        this.scrollY = window.pageYOffset;

        this.modalOpen();

        e.preventDefault();
      });
    }

    for (let j = 0; j < this.close.length; j++) {
      this.close[j].addEventListener('click', (e) => {
        this.modalClose();
        e.preventDefault();
      });
    }
  }

  adjustScreen(fixed) {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    if (fixed) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style = "";
    }
  }

  adjustSize() {
    if (this.large) {
      this.targetPanelId.classList.remove(this.largeClass);
      this.large = false;
    } else {
      let panelHeight = this.targetPanelId.clientHeight,
        windowHeight = document.documentElement.clientHeight;

      if (panelHeight >= windowHeight) {
        this.targetPanelId.classList.add(this.largeClass);
        this.large = true;
      }
    }
  }

  modalOpen() {
    this.effect();
    document.documentElement.style.top = `-${this.scrollY}px`;
    this.adjustScreen(true);
    this.targetPanelId.classList.add(this.activeClass);

    this.adjustSize();
    document.getElementsByTagName('html')[0].classList.add(this.fixedClass);
  }

  modalClose () {
    this.targetPanelId.classList.remove(this.activeClass);
    this.effect();
    this.adjustScreen(false);
    document.getElementsByTagName('html')[0].classList.remove(this.fixedClass);
    document.documentElement.style.top = '';
    if (this.scrollY) {
      window.scrollTo( 0, this.scrollY);
    }
    this.adjustSize();
  }

  effect() {
    if (!this.open) {
      this.layerFade.fadeIn();
      this.open = true;
    } else {
      this.layerFade.fadeOut();
      this.open = false;
    }
  }
}