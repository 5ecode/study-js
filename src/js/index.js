import { CarouselModule, LoopSlide, OneSideSlide, LoopCrossFade} from './module/carousel.js';
import { TablModule } from './module/tab.js';
import { ModalModule } from './module/modal.js';
import { ObserverModule } from './module/observer.js';
import { ToggleModule } from './module/toggle.js';
import { CallApiModule } from './module/callapi.js';

/*----------------------------------------------------------------------
@非同期処理
----------------------------------------------------------------------*/
class ApiUsersList extends CallApiModule {
  constructor(data) {
    super(data);
    this.tax = 10;
  }

  async init() {
    this.createSlideItem(await super.init());
  }

  createSlideItem(data) {
    const stage = document.getElementById('apiSlideItems'),
        separate = parseInt(stage.dataset.separate),
        _self = this;
        this.arr = [];
    data.shift();
    stage.innerHTML = '';
    for (let i = 0; i < Math.ceil(data.length / separate); i++){
      let j = i * separate,
          p = data.slice(j, j + separate);
      _self.arr.push(p);
    }

    for (let k = 0; k < this.arr.length; k++){
      let list = document.createElement('ul');
      list.className = 'm-carousel_item productList';

      for (let n = 0; n < this.arr[k].length; n++){
        let elementItem = document.createElement('li'),
          elementImg = document.createElement('figure'),
          elementDetail = document.createElement('div'),
          elementName = document.createElement('p'),
          elementPrice = document.createElement('p');

        elementItem.className = 'product';
        elementImg.className = 'product_img';
        elementDetail.className = 'product_detail';
        elementName.className = 'product_name';
        elementPrice.className = 'product_price';

        elementImg.innerHTML = '<img src="/assets/images/' + this.arr[k][n].img + '" alt="">';
        elementName.textContent = this.arr[k][n].name;
        elementPrice.innerHTML = this.priceAddTax(this.arr[k][n].price) + '<span>（税込）</span>';

        elementDetail.appendChild(elementName);
        elementDetail.appendChild(elementPrice);
        elementItem.appendChild(elementImg);
        elementItem.appendChild(elementDetail);
        list.appendChild(elementItem);
        stage.appendChild(list);
      }
    }

    const slideStage = document.getElementById('apiLateralMotion');
    const imgListSlide = new ApiSideSlide(slideStage);
    imgListSlide.init();
  }

  priceAddTax(price) {
    return this.addComma(Math.round(price + price * this.tax / 100));
  }

  addComma (price) {
    return '¥' + price.toLocaleString();
  }
}

/*----------------------------------------------------------------------
@apiスライド
----------------------------------------------------------------------*/
class ApiSideSlide extends CarouselModule{
  constructor(target) {
    super(target);
    this.pointerType = 'num';
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
@実行
----------------------------------------------------------------------*/
(function () {
  // スライダー
  const slideStage = document.getElementById('lateralMotion'),
    slideStage2 = document.getElementById('loopLateralMotion'),
    slideStage3 = document.getElementById('CrossFadeShow');
  const slideSet = new OneSideSlide(slideStage);
  slideSet.init();
  const slideSet2 = new LoopSlide(slideStage2);
  slideSet2.init();
  const slideSet3 = new LoopCrossFade(slideStage3);
  slideSet3.init();

  // タブコンテンツ
  const tabStage = document.getElementById('tabContents');
  const tabSet = new TablModule(tabStage);
  tabSet.init();

  // モーダル
  const modalSet = new ModalModule();
  modalSet.init();

  // 開閉表示
  const toggleStage1 = document.getElementById('toggleContents1');
  const toggleSet1 = new ToggleModule(toggleStage1);
  toggleSet1.oneEach();
  const toggleStage2 = document.getElementById('toggleContents2');
  const toggleSet2 = new ToggleModule(toggleStage2);
  toggleSet2.folding();
  const toggleStage3 = document.getElementById('toggleContents3');
  const toggleSet3 = new ToggleModule(toggleStage3);
  toggleSet3.oneEachFolding();

  // スクロールアクション
  const observerStage = document.getElementById('scrollAnimation');
  const observerSet = new ObserverModule(observerStage);
  observerSet.init();

  // api
  const apiSet = new ApiUsersList('/api/product_data.json');
  apiSet.init();

})();