import { renderPoints, hideMapShowList, showMapHideList, hideMap } from './map-render.js';
// import { activateAdForm, activateFilterForm, deactivateAllForms } from './form-master.js';
// import { setUserFormSubmit } from './form-master.js';
import { tableRender } from './list-render.js';
import { getData, ROUTES, ERROR_TEXT } from './network-utils.js';
import { showAlert, removeAlert } from './utils.js';
import { activateFilter } from './filter-master.js';


const listMapContainer = document.querySelector('#list-map-btn');
const buyerButton = document.querySelector('#buyer-btn');
const sellerButton = document.querySelector('#seller-btn');
const mapButton = document.querySelector('#map-btn');
const listButton = document.querySelector('#list-btn');



const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 9;
const ALERT_SHOW_TIME = 5000; // в милли секундах
let contractors = [];
let user = [];

// Начальные координаты карты
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

// Прячем карту на старте
hideMap();

// Хендлер на кнопки 'Список' и 'Карта'
listMapContainer.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (evt.target === mapButton) {
    showMapHideList();
  }
  if (evt.target === listButton) {
    hideMapShowList();
  }
});

// Инициализируем Леафлет (вызываем у L метод map(), чтобы создать карту), прикручиваем ее к блоку map и задаем начальный зум и начальные координаты
const map = L.map('map-container')
  // .on('load', console.log('leaflet started')) // в случае успешной загрузки карты, активируем формы на странице
  .setView(startCoordinate, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

// Задаем параметры иконок, используемых для отображения объявлений
const commonIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [30, 40],
});

// Задаем параметры маркера для проверенных предложений
const starIcon = L.icon({
  iconUrl: '../img/pin-verified.svg',
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
    activateFilter();
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
  map,
  contractors
  //   QTY_OF_ADS,
  //   ALERT_SHOW_TIME
};

