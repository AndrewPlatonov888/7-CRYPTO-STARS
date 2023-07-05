import { deactivateAllForms, showFormError, hideFormError, showFormSuccess } from './forms-master.js';
import { getDataOnStart, emulateChangeEvent } from './main.js';


const BASE_URL = 'https://cryptostar.grading.pages.academy';
const ROUTES = {
  GET_USER_DATA: '/user',
  GET_CONTRACTORS_DATA: '/contractors',
  SEND_DATA: '/',
};


//Функция отправки данных на сервер
const sendData = (body) => fetch(
  `${BASE_URL}${ROUTES.SEND_DATA}`,
  {
    method: 'POST',
    body,
  })
  .then((response) => {
    if (!response.ok) {
      showFormError();
    } else {
      deactivateAllForms();
      hideFormError();
      showFormSuccess();
      getDataOnStart(); // после успешной покупки/продажи --> обновляем данные с сервера --> при этом перерисовывается таблица
      emulateChangeEvent(); // событие 'change' вызывает перерисовку карты с новыми данными от сервера
    }
  })
  .catch(() => {
    showFormError();
  });


//Функция получения данных от сервера
const getData = (ROUTE) => fetch(
  `${BASE_URL}${ROUTE}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  })
  .catch(() => {
    throw new Error();
  });


export {
  sendData,
  ROUTES,
  getData
};
