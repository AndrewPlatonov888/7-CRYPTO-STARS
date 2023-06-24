import { isEscapeKey } from './utils.js';
import { mapContainer } from './map-render.js';

const modalBuyContainer = document.querySelector('.modal--buy');
const modalSellContainer = document.querySelector('.modal--sell');
const buyForm = document.querySelector('.modal-buy');
const sellForm = document.querySelector('.modal-sell');
const closeBuyFormBtn = document.querySelector('#close-buy-form');
const closeSellFormBtn = document.querySelector('#close-sell-form');
const buyFormContainer = document.querySelector('#buy-content');
const sellFormContainer = document.querySelector('#sell-content');
const mapWrapper = document.querySelector('#map-wrapper');

//Универсальная функция закрытия формы покупки/продажи по нажатию Esc
const onFormEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if (window.getComputedStyle(modalBuyContainer, null).display === 'block') {
      buyForm.reset();
      closeForm();
    }
    if (window.getComputedStyle(modalSellContainer, null).display === 'block') {
      sellForm.reset();
      closeForm();
    }
    document.body.style.position = '';
    document.body.style.top = '';
  }
};

//Универсальная функция закрытия формы покупки/продажи по нажатию на оверлей
const onFormOverlayClick = (evt) => {
  if (window.getComputedStyle(modalBuyContainer, null).display === 'block') {
    evt.preventDefault();
    if (!buyFormContainer.contains(evt.target)) {
      buyForm.reset();
      closeForm();
      mapContainer.style.cssText = 'display: block';
    }
  }
  if (window.getComputedStyle(modalSellContainer, null).display === 'block') {
    if (!sellFormContainer.contains(evt.target)) {
      sellForm.reset();
      closeForm();
      mapContainer.style.cssText = 'display: block';
    }
  }
};

//Универсальная функция закрытия формы покупки/продажи по нажатию кнопки 'Закрыть'
function closeForm() {
  if (window.getComputedStyle(modalBuyContainer, null).display === 'block') {
    modalBuyContainer.style.cssText = 'display: none';
    document.removeEventListener('keydown', onFormEscKeydown);
    document.removeEventListener('mouseup', onFormOverlayClick);
    buyForm.reset();
    closeBuyFormBtn.removeEventListener('click', closeForm);
  }
  if (window.getComputedStyle(modalSellContainer, null).display === 'block') {
    modalSellContainer.style.cssText = 'display: none';
    mapContainer.style.cssText = 'display: none';
    document.removeEventListener('keydown', onFormEscKeydown);
    document.removeEventListener('mouseup', onFormOverlayClick);
    buyForm.reset();
    closeSellFormBtn.removeEventListener('click', closeForm);
  }
  mapContainer.style.cssText = 'display: block';
  document.body.style.position = '';
  document.body.style.top = '';
}

function renderModalBuy(listOfContractors, idMarker) {
  mapWrapper.style.cssText = 'display: none';
  modalBuyContainer.style.cssText = 'display: block';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.addEventListener('keydown', onFormEscKeydown);
  document.addEventListener('mouseup', onFormOverlayClick);
  closeBuyFormBtn.addEventListener('click', closeForm); // Хендлер на закрытие формы покупки кнопкой
  const contractor = listOfContractors.filter((res) => res.id === idMarker);
}

function renderModalSell(listOfContractors, idMarker) {
  mapWrapper.style.cssText = 'display: none';
  modalSellContainer.style.cssText = 'display: block';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.addEventListener('keydown', onFormEscKeydown);
  document.addEventListener('mouseup', onFormOverlayClick);
  closeSellFormBtn.addEventListener('click', closeForm); // Хендлер на закрытие формы продажи кнопкой
  const contractor = listOfContractors.filter((res) => res.id === idMarker);
}


export {
  renderModalBuy,
  renderModalSell,
  onFormEscKeydown
};
