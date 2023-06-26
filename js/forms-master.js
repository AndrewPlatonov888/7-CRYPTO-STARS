import { isEscapeKey, blockSubmitButton, unblockSubmitButton } from './utils.js';
import { hideMap, isMapBtnActive, mapContainer } from './map-render.js';
import { sendData } from './network-utils.js';
import { user } from './main.js';

const ALERT_SHOW_TIME = 1000;
const PAYMENT_PASSWORD = '180712';

const modalBuyContainer = document.querySelector('.modal--buy');
const modalSellContainer = document.querySelector('.modal--sell');
const buyForm = document.querySelector('.modal-buy');
const sellForm = document.querySelector('.modal-sell');
const closeBuyFormBtn = document.querySelector('#close-buy-form');
const closeSellFormBtn = document.querySelector('#close-sell-form');
const buyFormContainer = document.querySelector('#buy-content');
const sellFormContainer = document.querySelector('#sell-content');
// const mapWrapper = document.querySelector('#map-wrapper');

//BUY FORM INPUTS
const inputSendingAmount = document.querySelector('#sendingAmount');
const inputReceivingAmount = document.querySelector('#receivingAmount');
const contractorId = document.querySelector('#contractorId');
const exchangeRate = document.querySelector('#exchangeRate');
const sendingCurrency = document.querySelector('#sendingCurrency');
const receivingCurrency = document.querySelector('#receivingCurrency');
const selectPaymentMethod = document.querySelector('#paymentMethod');
const userName = document.querySelector('#user-name');
const rate = document.querySelector('#rate');
const limits = document.querySelector('#limits');
const inputWallet = document.querySelector('#wallet');
const paymentPassword = document.querySelector('#payment-password');
const exchangeAllBtn = document.querySelector('#exchange-all');
const bankCardNumber = document.querySelector('#bankCardNumber');

let globalRate = 0;

//Подключаем валидатор Pristine
const pristine = new Pristine(buyForm);

//Функции, связывающие поля SendingAmount / ReceivingAmount
function changeSendingAmount() {
  // inputSendingAmount.value = (String((Number(inputReceivingAmount.value) * globalRate).toFixed(2)));
  inputSendingAmount.value = (String((Number(inputReceivingAmount.value) * globalRate)));
}
function changeReceivingAmount() {
  // inputReceivingAmount.value = (String((Number(inputSendingAmount.value) / globalRate).toFixed(2)));
  inputReceivingAmount.value = (String((Number(inputSendingAmount.value) / globalRate)));
}


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
      if (isMapBtnActive()) {
        mapContainer.style.cssText = 'display: block';
      }
    }
  }
  if (window.getComputedStyle(modalSellContainer, null).display === 'block') {
    if (!sellFormContainer.contains(evt.target)) {
      sellForm.reset();
      closeForm();
      if (isMapBtnActive()) {
        mapContainer.style.cssText = 'display: block';
      }
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
    if (isMapBtnActive()) {
      mapContainer.style.cssText = 'display: none';
    }
    document.removeEventListener('keydown', onFormEscKeydown);
    document.removeEventListener('mouseup', onFormOverlayClick);
    buyForm.reset();
    closeSellFormBtn.removeEventListener('click', closeForm);
  }
  if (isMapBtnActive()) {
    mapContainer.style.cssText = 'display: block';
  }
  document.body.style.position = '';
  document.body.style.top = '';
}

//Функция генерации SELECT'а
function generateOptionsList(paymentMethodsList, userData) {
  const firstValue = selectPaymentMethod.firstElementChild.value;
  selectPaymentMethod.innerHTML = '';
  for (let i = 0; i <= paymentMethodsList.length - 1; i++) {
    if (i === 0) {
      const firstOpt = document.createElement('option');
      firstOpt.innerHTML = firstValue;
      firstOpt.setAttribute('selected', '');
      firstOpt.setAttribute('disabled', '');
      selectPaymentMethod.appendChild(firstOpt);
    }
    const opt = document.createElement('option');
    opt.setAttribute('value', paymentMethodsList[i].provider);
    opt.innerHTML = paymentMethodsList[i].provider;
    for (let j = 0; j <= userData.paymentMethods.length - 1; j++) {
      if (!userData.paymentMethods[j].provider.includes(paymentMethodsList[i].provider) && paymentMethodsList[i].provider !== 'Cash in person') {
        opt.setAttribute('disabled', '');
      }
    }
    selectPaymentMethod.appendChild(opt);
  }
}

//Функция 'обменять ВСЕ'
function exchangeAll() {
  inputSendingAmount.value = inputSendingAmount.max;
  inputReceivingAmount.value = (String((Number(inputSendingAmount.value) / globalRate).toFixed(2)));
}

//Функция установки номера карты/аккаунта в поле bankCardNumber по выбору метода платежа
function setBankCardNumber() {
  const selectedMethod = selectPaymentMethod.options[selectPaymentMethod.selectedIndex].value;
  if (selectedMethod === 'Cash in person'){
    bankCardNumber.placeholder = '';
    return;
  }
  const selectedMethodData = user.paymentMethods.filter((res) => res.provider === selectedMethod);
  bankCardNumber.placeholder = selectedMethodData[0].accountNumber;
}

function renderModalBuy(listOfContractors, userInfo, idMarker) {
  console.log('userInfo=');
  console.log(userInfo);
  const space = String.fromCharCode(160);
  const maxAmount = userInfo.balances.filter((res) => res.currency === 'RUB');
  const contractor = listOfContractors.filter((res) => res.id === idMarker);
  globalRate = Number(contractor[0].exchangeRate);
  // globalRate = Number(userInfo.exchangeRate);
  inputSendingAmount.max = maxAmount[0].amount;
  hideMap();
  modalBuyContainer.style.cssText = 'display: block';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.addEventListener('keydown', onFormEscKeydown);
  document.addEventListener('mouseup', onFormOverlayClick);
  closeBuyFormBtn.addEventListener('click', closeForm); // Хендлер на закрытие формы покупки кнопкой
  inputSendingAmount.addEventListener('change', changeReceivingAmount);// Обработчик на связанные поля SendingAmount ReceivingAmount
  inputReceivingAmount.addEventListener('change', changeSendingAmount);// Обработчик на связанные поля SendingAmount ReceivingAmount
  exchangeAllBtn.addEventListener('click', exchangeAll);
  userName.textContent = userInfo.userName;
  rate.textContent = `${contractor[0].exchangeRate}${space}${'₽'}`;
  limits.innerHTML = `${contractor[0].minAmount}${space}${'₽'}${space}${'-'}${space}${maxAmount[0].amount}${space}${'₽'}`;
  inputSendingAmount.min = contractor[0].minAmount;
  inputSendingAmount.max = maxAmount[0].amount;
  inputReceivingAmount.max = contractor[0].balance.amount;
  contractorId.value = contractor[0].id;
  exchangeRate.value = globalRate;
  sendingCurrency.value = contractor[0].paymentMethods[0].currency;
  receivingCurrency.value = contractor[0].balance.currency;
  generateOptionsList(contractor[0].paymentMethods, userInfo);
  selectPaymentMethod.addEventListener('change', setBankCardNumber); // по выбору метода платежа, ставим в поле номер карты/номер счета клиента
  // inputWallet.removeAttribute('type');
  inputWallet.setAttribute('disabled', '');
  inputWallet.placeholder = userInfo.wallet.address;
  // inputWallet.readOnly = true;
  // inputWallet.setAttribute('tabindex', '-1');
  paymentPassword.value = PAYMENT_PASSWORD;
}

function renderModalSell(listOfContractors, userInfo, idMarker) {
  console.log(userInfo);
  // mapWrapper.style.cssText = 'display: none';
  modalSellContainer.style.cssText = 'display: block';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
  document.addEventListener('keydown', onFormEscKeydown);
  document.addEventListener('mouseup', onFormOverlayClick);
  // Обработчики на selector'ы timein и timeout
  inputSendingAmount.addEventListener('change', changeReceivingAmount);
  inputReceivingAmount.addEventListener('change', changeSendingAmount);
  closeSellFormBtn.addEventListener('click', closeForm); // Хендлер на закрытие формы продажи кнопкой
  const contractor = listOfContractors.filter((res) => res.id === idMarker);
}


//Хендлер на отправку формы Buy
const setUserFormSubmit = (onSuccess) => {
  buyForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    // const isValid = pristine.validate();
    const isValid = true;
    if (isValid) {
      // blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(onSuccess)
        .catch(
          () => {
            blockSubmitButton();
            setTimeout(() => {
              unblockSubmitButton();
            }, ALERT_SHOW_TIME);
          }
        );
    }

    //  else {
    //   if (titleInput.value === '') {
    //     titleInput.parentNode.classList.add('ad-form__element--invalid');
    //     showAlert(TITLE_ALERT_MESSAGE);
    //   }
    // }
  });
};


export {
  renderModalBuy,
  renderModalSell,
  onFormEscKeydown,
  setUserFormSubmit
};
