import { isEscapeKey, blockSubmitButton, unblockSubmitButton } from './utils.js';
import { hideMap, isMapBtnActive, mapContainer } from './map-render.js';
import { sendData } from './network-utils.js';
import { user } from './main.js';

const ALERT_SHOW_TIME = 1000;
const PAYMENT_PASSWORD = '180712';
const ERROR_CLASS = 'custom-input__error';
const ERROR_COLOR = '#ed7358';
const BASE_CURRENCY = '₽';

const modalBuyContainer = document.querySelector('.modal--buy');
// const modalSellContainer = document.querySelector('.modal--sell');
const buyForm = document.querySelector('.modal-buy');
// const sellForm = document.querySelector('.modal-sell');
const closeBuyFormBtn = document.querySelector('#close-buy-form');
// const closeSellFormBtn = document.querySelector('#close-sell-form');
const buyFormContainer = document.querySelector('#buy-content');
// const sellFormContainer = document.querySelector('#sell-content');

//FORM INPUTS
const inputType = document.querySelector('#type');
const sellHeader = document.querySelector('#sell-header');
const buyHeader = document.querySelector('#buy-header');
const initialBuyHeader = buyHeader.textContent;
const receivingCurrencyMarker = document.querySelector('#recieving-currency');
const initialReceivingCurrency = receivingCurrencyMarker.textContent;
const sendingCurrencyMarker = document.querySelector('#sending-currency');
const initialSendingCurrency = sendingCurrencyMarker.textContent;

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
const initPlaceholderCardNumber = bankCardNumber.placeholder;
const buyPwLabelParent = document.querySelector('#buy-payment-pw-label').parentElement;
const buySelectParent = selectPaymentMethod.parentElement;
const receivingLabel = document.querySelector('#receiving-label');

// messages
const buyMessageError = document.querySelector('#buy-message--error');
const sellMessageError = document.querySelector('#sell-message--error');
const buyMessageSuccess = document.querySelector('#buy-message--success');
const sellMessageSuccess = document.querySelector('#sell-message--success');
const buyInputErrorMessage = document.querySelector('#custom-input__error-buy');
// const sellInputErrorMessage = document.querySelector('#custom-input__error-sell');
const pwErrorMessage = document.createElement('span');
const selectErrorMessage = document.createElement('span');

//submits
const submitBtn = document.querySelector('#buy-submit-btn');

let globalRate = 0;
let isBuyFormActive;
// let isSellFormActive = false;
let initialCurrency;
let targetCurrency;
let enrollmentExchangeAllBtn;

//Подключаем валидатор Pristine на buyForm и sellForm
const pristineBuy = new Pristine(buyForm);

//Универсальная функция, показывающая ошибку формы КУПИТЬ/ПРОДАТЬ
function showFormError() {
  buyMessageError.style.cssText = 'display: flex';
  sellMessageError.style.cssText = 'display: flex';
}

//Универсальная функция, убирающая ошибку формы КУПИТЬ/ПРОДАТЬ
function hideFormError() {
  buyMessageError.style.cssText = 'display: none';
  sellMessageError.style.cssText = 'display: none';
}

// Универсальная функция, показывающая сообщение об успешной отправке формы КУПИТЬ/ПРОДАТЬ
function showFormSuccess() {
  buyMessageSuccess.style.cssText = 'display: flex';
  sellMessageSuccess.style.cssText = 'display: flex';
}

// Универсальная функция, убирающая сообщение об успешной отправке формы КУПИТЬ/ПРОДАТЬ
function hideFormSuccess() {
  buyMessageSuccess.style.cssText = 'display: none';
  sellMessageSuccess.style.cssText = 'display: none';
}

//Функции, связывающие поля SendingAmount / ReceivingAmount
function changeSendingAmount() {
  if (isBuyFormActive) {
    inputSendingAmount.value = (String((Number(inputReceivingAmount.value) * globalRate)));
  } else {
    inputSendingAmount.value = (String((Number(inputReceivingAmount.value) / globalRate)));
  }
}

function changeReceivingAmount() {
  if (isBuyFormActive) {
    inputReceivingAmount.value = (String((Number(inputSendingAmount.value) / globalRate)));
  } else {
    inputReceivingAmount.value = (String((Number(inputSendingAmount.value) * globalRate)));
  }
}


//Универсальная функция закрытия формы покупки/продажи по нажатию Esc
const onFormEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeForm();
    document.body.style.position = '';
    document.body.style.top = '';
  }
};

//Универсальная функция закрытия формы покупки/продажи по нажатию на оверлей
const onFormOverlayClick = (evt) => {
  evt.preventDefault();
  if (!buyFormContainer.contains(evt.target)) {
    closeForm();
    if (isMapBtnActive()) {
      mapContainer.style.cssText = 'display: block';
    }
  }
};

//Универсальная функция закрытия формы покупки/продажи по нажатию кнопки 'Закрыть'
function closeForm() {
  modalBuyContainer.style.cssText = 'display: none';
  removeFormListeners();
  receivingCurrencyMarker.textContent = initialReceivingCurrency;
  sendingCurrencyMarker.textContent = initialSendingCurrency;
  buyForm.reset();
  if (isMapBtnActive()) {
    mapContainer.style.cssText = 'display: block';
  }
  document.body.style.position = '';
  document.body.style.top = '';
  if (!isBuyFormActive) {
    enrollmentExchangeAllBtn.removeEventListener('click', exchangeAll);
    enrollmentExchangeAllBtn.remove();
  }
}

//Универсальная функция генерации SELECT'а
function generateOptionsList(paymentMethodsList, userData) {
  const firstValue = selectPaymentMethod.firstElementChild.value;
  const userPaymentData = Object.values(userData.paymentMethods); // вытаскиваем в массив
  const userPaymentMethods = userPaymentData.map((res) => res.provider); // доступные юзеру платежные системы
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
    if (!userPaymentMethods.includes(paymentMethodsList[i].provider) && paymentMethodsList[i].provider !== 'Cash in person') {
      opt.setAttribute('disabled', ''); // если у покупателя отсутсвует такой метод платежа - то отключаем его в селекте
    }
    selectPaymentMethod.appendChild(opt);
  }
}

// Функция создания дополнительной кнопки "Обменять все" над полем "Зачисление"
function createEnrollmentExchangeAllBtn() {
  enrollmentExchangeAllBtn = exchangeAllBtn.cloneNode(true);
  enrollmentExchangeAllBtn.setAttribute('id', 'enrollment-exchange-all');
  receivingLabel.appendChild(enrollmentExchangeAllBtn);
  enrollmentExchangeAllBtn.addEventListener('click', exchangeAll);
}

//Функции 'обменять ВСЕ'
function exchangeAll() {
  inputSendingAmount.value = inputSendingAmount.max;
  if (isBuyFormActive) {
    inputReceivingAmount.value = (String((Number(inputSendingAmount.value) / globalRate)));
  } else {
    inputReceivingAmount.value = (String((Number(inputSendingAmount.value) * globalRate)));
  }
}

//Функция установки номера карты/аккаунта в поле bankCardNumber по выбору метода платежа
function setBankCardNumber() {
  const selectedMethod = selectPaymentMethod.options[selectPaymentMethod.selectedIndex].value;
  if (selectedMethod === 'Cash in person') {
    bankCardNumber.placeholder = '';
    return;
  }
  const selectedMethodData = user.paymentMethods.filter((res) => res.provider === selectedMethod);
  bankCardNumber.placeholder = selectedMethodData[0].accountNumber;
}

//Функция блокировки всех форм после успешной отправки
function deactivateAllForms() {
  exchangeAllBtn.removeEventListener('click', exchangeAll);
  inputSendingAmount.setAttribute('disabled', '');
  inputReceivingAmount.setAttribute('disabled', '');
  selectPaymentMethod.setAttribute('disabled', '');
  paymentPassword.setAttribute('disabled', '');
  submitBtn.setAttribute('disabled', '');
  exchangeAllBtn.setAttribute('disabled', '');
}

//Функция разблокировки всех форм при открытии формы
function activateAllForms() {
  inputSendingAmount.removeAttribute('disabled', '');
  inputReceivingAmount.removeAttribute('disabled', '');
  selectPaymentMethod.removeAttribute('disabled', '');
  paymentPassword.removeAttribute('disabled', '');
  submitBtn.removeAttribute('disabled', '');
  exchangeAllBtn.removeAttribute('disabled', '');
  bankCardNumber.placeholder = initPlaceholderCardNumber;
}

//Функция определения исходной валюты
function detectInitialCurrency(isBuyFormSelectorEnabled) {
  if (isBuyFormSelectorEnabled) {
    initialCurrency = 'RUB';
    targetCurrency = 'KEKS';
  } else {
    initialCurrency = 'KEKS';
    targetCurrency = 'RUB';
  }
}

// Функция установки всех листенеров на форму
function setFormListeners() {
  document.addEventListener('keydown', onFormEscKeydown);
  document.addEventListener('mouseup', onFormOverlayClick);
  closeBuyFormBtn.addEventListener('click', closeForm); // Хендлер на закрытие формы покупки кнопкой
  inputSendingAmount.addEventListener('change', changeReceivingAmount);// Обработчик на связанные поля SendingAmount ReceivingAmount
  inputReceivingAmount.addEventListener('change', changeSendingAmount);// Обработчик на связанные поля SendingAmount ReceivingAmount
  exchangeAllBtn.addEventListener('click', exchangeAll);
  selectPaymentMethod.addEventListener('change', setBankCardNumber); // по выбору метода платежа, ставим в поле номер карты/номер счета клиента
}

// Функция удаления всех листенеров
function removeFormListeners() {
  document.removeEventListener('keydown', onFormEscKeydown);
  document.removeEventListener('mouseup', onFormOverlayClick);
  closeBuyFormBtn.removeEventListener('click', closeForm);
  inputSendingAmount.removeEventListener('change', changeReceivingAmount);
  inputReceivingAmount.removeEventListener('change', changeSendingAmount);
  exchangeAllBtn.removeEventListener('click', exchangeAll);
  selectPaymentMethod.removeEventListener('change', setBankCardNumber);
}

// Универсальная функция отрисовки ФОРМЫ (BUY/SELL)
function renderModalBuy(listOfContractors, userInfo, idMarker, isBuyFormSwitcherEnabled) {
  document.body.style.position = 'fixed'; // убираем скролл
  document.body.style.top = `-${window.scrollY}px`; // убираем скролл
  hideMap();
  hideFormSuccess();
  hideFormError();
  detectInitialCurrency(isBuyFormSwitcherEnabled);
  activateAllForms();
  isBuyFormActive = isBuyFormSwitcherEnabled;
  const space = String.fromCharCode(160);
  const maxAmount = userInfo.balances.filter((res) => res.currency === initialCurrency);
  const contractor = listOfContractors.filter((res) => res.id === idMarker);

  console.log('contractor=');
  console.log(contractor);
  globalRate = Number(contractor[0].exchangeRate);
  modalBuyContainer.style.cssText = 'display: block';
  setFormListeners();
  userName.textContent = userInfo.userName;
  rate.textContent = `${contractor[0].exchangeRate}${space}${BASE_CURRENCY}`;
  limits.innerHTML = `${contractor[0].minAmount}${space}${BASE_CURRENCY}${space}${'-'}${space}${maxAmount[0].amount}${space}${initialCurrency}`;
  if (!isBuyFormSwitcherEnabled) {
    limits.innerHTML = `${contractor[0].minAmount}${space}${BASE_CURRENCY}${space}${'-'}${space}${(maxAmount[0].amount * globalRate).toFixed(0)}${space}${BASE_CURRENCY}`;
  }
  buyInputErrorMessage.innerHTML = '';
  inputSendingAmount.min = contractor[0].minAmount;
  inputSendingAmount.max = maxAmount[0].amount;
  inputReceivingAmount.max = contractor[0].balance.amount;
  inputReceivingAmount.min = contractor[0].minAmount / globalRate;
  contractorId.value = contractor[0].id;
  exchangeRate.value = globalRate;
  sendingCurrency.value = initialCurrency;
  sendingCurrencyMarker.textContent = initialCurrency;
  receivingCurrency.value = targetCurrency;
  receivingCurrencyMarker.textContent = targetCurrency;
  inputWallet.setAttribute('disabled', '');
  if (isBuyFormSwitcherEnabled) {
    generateOptionsList(contractor[0].paymentMethods, userInfo);
    inputWallet.placeholder = userInfo.wallet.address;
    inputSendingAmount.min = contractor[0].minAmount;
    inputSendingAmount.max = maxAmount[0].amount;
    inputReceivingAmount.max = contractor[0].balance.amount;
    inputReceivingAmount.min = contractor[0].minAmount / globalRate;
    inputType.value = 'BUY';
    buyHeader.textContent = initialBuyHeader;
  } else {
    buyHeader.textContent = sellHeader.textContent;
    inputType.value = 'SELL';
    generateOptionsList(userInfo.paymentMethods, userInfo);
    inputWallet.placeholder = contractor[0].wallet.address;
    inputSendingAmount.min = contractor[0].minAmount / globalRate;
    inputSendingAmount.max = maxAmount[0].amount;
    inputReceivingAmount.max = contractor[0].balance.amount;
    inputReceivingAmount.min = contractor[0].minAmount;
    createEnrollmentExchangeAllBtn();
  }
  paymentPassword.value = '';
  pwErrorMessage.classList.add(ERROR_CLASS); //Создаем сообщение об ошибке для поля Платежный пароль
  pwErrorMessage.innerHTML = '';
  buyPwLabelParent.appendChild(pwErrorMessage);
  selectErrorMessage.style.cssText = `${'color: '}${ERROR_COLOR}${'; font-weight: 400'}`; //Создаем сообщение об ошибке для SELECT
  selectErrorMessage.innerHTML = '';
  buySelectParent.appendChild(selectErrorMessage);
}

// === В А Л И Д А Ц И Я =============================================================================

//Функция валидации поля SendingAmount
function validateSendingAmount(field) {
  const keks = Number(field) / globalRate;
  if (Number(field) < Number(inputSendingAmount.min)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Минимальная покупка от '}${inputSendingAmount.min}${' '}${sendingCurrency.value}`;
    return false;
  }
  if (Number(field) > Number(inputSendingAmount.max)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Превышен лимит доступных средств: '}${inputSendingAmount.max}${' '}${sendingCurrency.value}`;
    return false;
  }
  if (keks > Number(inputReceivingAmount.max)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'У продавца доступно максимум '}${inputReceivingAmount.max}${' '}${receivingCurrency.value}`;
    return false;
  }
  if (Number(field) <= 0) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Размер оплаты должен быть больше 0 '}${sendingCurrency.value}`;
    return false;
  }
  hideFormError();
  buyInputErrorMessage.innerHTML = '';
  return true;
}

// Функция валидации поля ReceivingAmount
function validateReceivingAmount(field) {
  let rub = Number(field) * globalRate;
  if (!isBuyFormActive) {
    rub = Number(field) / globalRate;
  }
  if (Number(field) > Number(inputReceivingAmount.max)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'У продавца доступно максимум '}${inputReceivingAmount.max}${' '}${receivingCurrency.value}`;
    return false;
  }
  if (Number(field) < Number(inputReceivingAmount.min)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Минимальное зачисление от '}${inputReceivingAmount.min}${' '}${receivingCurrency.value}`;
    return false;
  }
  if (rub > Number(inputSendingAmount.max)) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Превышен лимит доступных средств: '}${inputSendingAmount.max}${' '}${sendingCurrency.value}`;
    return false;
  }
  if (Number(field) <= 0) {
    showFormError();
    buyInputErrorMessage.innerHTML = `${'Размер зачисления должен быть больше 0 '}${receivingCurrency.value}`;
    return false;
  }
  hideFormError();
  buyInputErrorMessage.innerHTML = '';
  return true;
}

// Функция валидации поля 'Платежный пароль'
function validatePaymentPassword(field) {
  if (field === '') {
    showFormError();
    pwErrorMessage.innerHTML = 'Введите платежный пароль';
    return false;
  }
  hideFormError();
  pwErrorMessage.innerHTML = '';
  return true;
}

// Функция валидации SELECT с платежными системами
function validateSelectPaymentMethods(field) {
  if (field === selectPaymentMethod.firstChild.value) {
    showFormError();
    selectErrorMessage.innerHTML = 'Выберите доступную платежную систему';
    return false;
  }
  hideFormError();
  selectErrorMessage.innerHTML = '';
  return true;
}

// Подключаем Pristine на поле inputReceivingAmount
pristineBuy.addValidator(
  inputReceivingAmount,
  validateReceivingAmount
);

// Подключаем Pristine на поле inputSendingAmount
pristineBuy.addValidator(
  inputSendingAmount,
  validateSendingAmount
);

// Подключаем Pristine на поле paymentPassword
pristineBuy.addValidator(
  paymentPassword,
  validatePaymentPassword
);

pristineBuy.addValidator(
  selectPaymentMethod,
  validateSelectPaymentMethods
);


//Универсальный Хендлер на отправку формы Buy и Sell
const setUserFormSubmit = (onSuccess) => {
  buyForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let currentActiveForm;
    const isValidBuy = pristineBuy.validate();
    // const isValidSell = pristineSell.validate();
    if (isBuyFormActive) {
      currentActiveForm = isValidBuy;
    }
    // if (isSellFormActive) {
    //   currentActiveForm = isValidSell;
    // }
    if (currentActiveForm) {
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
    else {
      showFormError();
    }
  });
};

export {
  renderModalBuy,
  onFormEscKeydown,
  setUserFormSubmit,
  buyMessageSuccess,
  sellMessageSuccess,
  deactivateAllForms,
  showFormError,
  hideFormError,
  showFormSuccess,
  isBuyFormActive,
  // isSellFormActive
};
