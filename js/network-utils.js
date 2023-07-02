import { buyMessageSuccess, sellMessageSuccess, deactivateAllForms, showFormError, hideFormError, showFormSuccess } from './forms-master.js';

// const confirmationTemplate = document.querySelector('#success').content.querySelector('.success');
// const confirmationElement = confirmationTemplate.cloneNode(true);
// const mistakeTemplate = document.querySelector('#error').content.querySelector('.error');
// const mistakeElement = mistakeTemplate.cloneNode(true);
const BASE_URL = 'https://cryptostar.grading.pages.academy';
const ROUTES = {
  GET_USER_DATA: '/user',
  GET_CONTRACTORS_DATA: '/contractors',
  SEND_DATA: '/',
};
const ERROR_TEXT = {
  USER_DATA_ERROR: 'Не удалось загрузить данные о ПОЛЬЗОВАТЕЛЕ. Попробуйте обновить страницу через 5 секунд',
  CONTRACTORS_DATA_ERROR: 'Не удалось загрузить данные о КОНТРАГЕНТАХ. Попробуйте обновить страницу через 5 секунд',
  SEND_DATA_ERROR: 'Не удалось отправить форму. Попробуйте повторить отправку через 5 секунд',
};


// //Функция нажатия на Esc/ на кнопку ОК/ на пространство вне сообщения при появившемся подтверждении отправки
// const onConfirmationMessageEvent = (evt) => {
//   const confirmationMessage = document.querySelector('.success');
//   if (isEscapeKey(evt) || confirmationMessage.contains(evt.target)) {
//     evt.preventDefault();
//     confirmationElement.remove();
//     resetAdForm();
//     unblockSubmitButton();
//     document.removeEventListener('keydown', onConfirmationMessageEvent);
//     document.removeEventListener('mouseup', onConfirmationMessageEvent);
//   }
// };

// //Функция нажатия на Esc/ на кнопку ОК/ на пространство вне сообщения при появившемся сообщении об ошибке
// const onMistakeMessageEvent = (evt) => {
//   const mistakeMessage = document.querySelector('.error');
//   const mistakeButton = mistakeMessage.querySelector('.error__button');
//   if (isEscapeKey(evt) || mistakeMessage.contains(evt.target) || mistakeButton.contains(evt.target)) {
//     evt.preventDefault();
//     mistakeElement.remove();
//     document.removeEventListener('keydown', onMistakeMessageEvent);
//     document.removeEventListener('mouseup', onMistakeMessageEvent);
//   }
// };


//Функция отправки данных на сервер
const sendData = (body) => fetch(
  `${BASE_URL}${ROUTES.SEND_DATA}`,
  {
    method: 'POST',
    body,
  })
  .then((response) => {
    if (!response.ok) {
      console.log('проблема с отправкой');
      showFormError();
      throw new Error();
    } else {
      console.log('успешно отправили');
      deactivateAllForms();
      hideFormError();
      showFormSuccess();
    }
  });
  // .catch(() => {
  //   showMistake();
  //   document.addEventListener('keydown', onMistakeMessageEvent);
  //   document.addEventListener('mouseup', onMistakeMessageEvent);
  //   throw new Error(ErrorText.SEND_DATA);
  // });


//Функция получения данных от сервера
const getData = (ROUTE, ERR_MESSAGE) => fetch(
  `${BASE_URL}${ROUTE}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  })
  .catch(() => {
    throw new Error(ERR_MESSAGE);
  });


export {
  sendData,
  ROUTES,
  ERROR_TEXT,
  getData
  // onMistakeMessageEvent,
  // onConfirmationMessageEvent
};
