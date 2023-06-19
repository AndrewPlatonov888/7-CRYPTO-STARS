// import { renderPoints } from './ads-render.js';
// import { activateAdForm, activateFilterForm, deactivateAllForms } from './form-master.js';
// import { setUserFormSubmit } from './form-master.js';
import { getData, ROUTES, ERROR_TEXT } from './network-utils.js';
import { showAlert, removeAlert } from './utils.js';
// import { activateFilter } from './filter-master.js';

// const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// const ZOOM = 13;
// const QTY_OF_ADS = 10;
const ALERT_SHOW_TIME = 5000; // в милли секундах
let contractors = [];
let user = [];
// const newPointInput = document.querySelector('#address');

// // Сначала дисейблим все формы на странице
// deactivateAllForms();

// // Начальные координаты карты
// const startCoordinate = {
//   lat: 35.6785,
//   lng: 139.7521,
// };

// // Координаты центра города (при загрузке страницы туда ставиться перемещаемая метка)
// const cityCenter = {
//   lat: 35.67500,
//   lng: 139.75000,
// };

// // пишем при старте координаты центра города в Input address
// newPointInput.value = `${cityCenter.lat}${', '}${cityCenter.lng}`;

// // Инициализируем Леафлет (вызываем у L метод map(), чтобы создать карту), прикручиваем ее к блоку map-canvas и задаем начальный зум
// const map = L.map('map-canvas')
//   .on('load', activateAdForm) // в случае успешной загрузки карты, активируем формы на странице
//   .setView(startCoordinate, ZOOM);

// L.tileLayer(TILE_LAYER, {
//   attribution: COPYRIGHT
// }).addTo(map);

// // Задаем параметры иконок, используемых для отображения объявлений  ( 40 х 40 пикселей)
// const adIcon = L.icon({
//   iconUrl: '../vendor/leaflet/images/marker-icon.png',
//   iconSize: [30, 40],
// });

// // Задаем параметры маркера передвигаемого юзером при размещении нового объявления  ( 52 х 52 пикселя)
// const userIcon = L.icon({
//   iconUrl: '../vendor/leaflet/images/main-pin.svg',
//   iconSize: [52, 52],
// });

// const usermarker = L.marker(cityCenter, {
//   draggable: true,
//   icon: userIcon,
// });

// usermarker.addTo(map);

// // Функция сброса юзерского маркера в исходное состояние
// function resetUserMarker() {
//   usermarker.setLatLng(cityCenter);
// }

// // Обработчик на перетаскивание юзер-метки. Возвращает новые координаты по окончанию перетаскивания и вставляет их в input #address
// usermarker.on('moveend', (evt) => {
//   const newPoint = evt.target.getLatLng();
//   newPoint.lat = Math.round(newPoint.lat * 100000) / 100000;
//   newPoint.lng = Math.round(newPoint.lng * 100000) / 100000;
//   newPointInput.value = `${newPoint.lat}${', '}${newPoint.lng}`;
// });

// Получаем с сервера данные контракторов
getData(ROUTES.GET_CONTRACTORS_DATA, ERROR_TEXT.CONTRACTORS_DATA_ERROR)
  .then((ads) => {
    contractors = ads;
    // activateFilterForm();
    // activateFilter();
    // renderPoints(offers);
    console.log(contractors);
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

// export {
//   resetUserMarker,
//   cityCenter,
//   newPointInput,
//   offers,
//   adIcon,
//   map,
//   QTY_OF_ADS,
//   ALERT_SHOW_TIME
// };

