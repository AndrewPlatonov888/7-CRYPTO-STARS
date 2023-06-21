import { renderPoints } from './points-render.js';
// import { activateAdForm, activateFilterForm, deactivateAllForms } from './form-master.js';
// import { setUserFormSubmit } from './form-master.js';
import { tableRender } from './list-render.js';
import { getData, ROUTES, ERROR_TEXT } from './network-utils.js';
import { showAlert, removeAlert } from './utils.js';
// import { activateFilter } from './filter-master.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 9;
// const QTY_OF_ADS = 10;
const ALERT_SHOW_TIME = 5000; // в милли секундах
let contractors = [];
let user = [];
// const newPointInput = document.querySelector('#address');

// // Сначала дисейблим все формы на странице
// deactivateAllForms();

// Начальные координаты карты
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};


// Инициализируем Леафлет (вызываем у L метод map(), чтобы создать карту), прикручиваем ее к блоку map и задаем начальный зум и начальные координаты
const map = L.map('map-container')
  // .on('load', console.log('leaflet started')) // в случае успешной загрузки карты, активируем формы на странице
  .setView(startCoordinate, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

// Задаем параметры иконок, используемых для отображения объявлений
const commonIcon = L.icon({
  iconUrl: '../leaflet/images/marker-icon.png',
  iconSize: [30, 40],
});

// Задаем параметры маркера для проверенных предложений
const starIcon = L.icon({
  iconUrl: '../leaflet/images/main-pin.svg',
  iconSize: [40, 50],
});


// Получаем с сервера данные контракторов
getData(ROUTES.GET_CONTRACTORS_DATA, ERROR_TEXT.CONTRACTORS_DATA_ERROR)
  .then((ads) => {
    contractors = ads;
    // activateFilterForm();
    // activateFilter();
    console.log(contractors);
    console.log(contractors[0]);
    tableRender(contractors);
    renderPoints(contractors);
  })
  .catch(
    (err) => {
      showAlert(err);
      // blockSubmitButton();
      setTimeout(() => {
        // unblockSubmitButton();
        removeAlert();
      }, ALERT_SHOW_TIME);
    }
  );


// Получаем с сервера данные пользователя
getData(ROUTES.GET_USER_DATA, ERROR_TEXT.USER_DATA_ERROR)
  .then((info) => {
    user = info;
    // activateFilterForm();
    // activateFilter();
    // renderPoints(offers);
    console.log(user);
  })
  .catch(
    (err) => {
      showAlert(err);
      // blockSubmitButton();
      setTimeout(() => {
        // unblockSubmitButton();
        removeAlert();
      }, ALERT_SHOW_TIME);
    }
  );

// setUserFormSubmit();

export {
  //   resetUserMarker,
  //   cityCenter,
  //   newPointInput,
  //   offers,
  commonIcon,
  starIcon,
  map
  //   QTY_OF_ADS,
  //   ALERT_SHOW_TIME
};

