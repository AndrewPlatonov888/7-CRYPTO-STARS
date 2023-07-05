import { renderPoints, hideMapShowList, showMapHideList, hideMap } from './map-render.js';
import { renderModalForm, setUserFormSubmit } from './forms-master.js';
import { tableRender, isSaleBtnActive } from './list-render.js';
import { getData, ROUTES } from './network-utils.js';
import { showLoadAlert, removeAlerts, showEmptyAlert } from './utils.js';
import { activateFilter, filterContainer, isEmptyAlert } from './filter-master.js';


const btnListMapContainer = document.querySelector('#list-map-btn');
const btnBuySellContainer = document.querySelector('#buy-sell-btn');
const btnExchangeContainer = document.querySelector('.users-list__table-body');
const btnMapExchangeContainer = document.querySelector('.map');
const buyButton = document.querySelector('#buy-btn');
const sellButton = document.querySelector('#sell-btn');
const mapButton = document.querySelector('#map-btn');
const listButton = document.querySelector('#list-btn');
const userProfileCrypto = document.querySelector('#user-crypto-balance');
const userProfileFiat = document.querySelector('#user-fiat-balance');
const userProfileName = document.querySelector('#user-profile-name');


const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 9;
let contractors = [];
let user = [];
let buyFormTrigger;

// Начальные координаты карты
const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

// Прячем карту на старте
hideMap();

//Функция наполения блока User Profile
function fillUserProfile() {
  userProfileName.textContent = user.userName;
  const userFiatValue = user.balances.filter((res) => res.currency === 'RUB');
  userProfileFiat.textContent = userFiatValue[0].amount;
  const userCryptoValue = user.balances.filter((res) => res.currency === 'KEKS');
  userProfileCrypto.textContent = userCryptoValue[0].amount;
}

// Функция переключения кнопок 'Купить' и 'Продать'
function activateBuyOrSellBtn() {
  buyButton.classList.toggle('is-active');
  sellButton.classList.toggle('is-active');
}

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

// Функция получения данных от сервера на старте
function getDataOnStart() {
  // Получаем с сервера данные юзера
  getData(ROUTES.GET_USER_DATA)
    .then((info) => {
      removeAlerts();
      user = info;
      if (user.length === 0) {
        showLoadAlert();
      } else {
        fillUserProfile(); //Наполняем информацией блок User Profile
        // Получаем с сервера данные контракторов
        getData(ROUTES.GET_CONTRACTORS_DATA)
          .then((ads) => {
            contractors = ads;
            activateFilter();
            tableRender(contractors);
            renderPoints(contractors);
            // }
          })
          .catch(
            () => {
              showEmptyAlert();
            }
          );
      }
    })
    .catch(
      () => {
        showLoadAlert();
      }
    );
}

getDataOnStart(); // Получение с сервера данных пользователя и данных контрагентов

// Хендлер на кнопки 'Список' и 'Карта'
btnListMapContainer.addEventListener('click', (evt) => {
  if (evt.target === mapButton) {
    showMapHideList();
  }
  if (evt.target === listButton) {
    hideMapShowList();
    map.closePopup();
    if (isEmptyAlert) {
      showEmptyAlert();
    }
  }
});

//Хендлер на кнопки 'Обменять' в списке
btnExchangeContainer.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    if (isSaleBtnActive()) {
      buyFormTrigger = false;
    } else {
      buyFormTrigger = true;
      renderModalForm(contractors, user, evt.target.id, buyFormTrigger);
      return;
    }
    renderModalForm(contractors, user, evt.target.id, buyFormTrigger);
  }
});

//Хендлер на кнопки 'Обменять' на карте
btnMapExchangeContainer.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    buyFormTrigger = true;
    renderModalForm(contractors, user, evt.target.id, buyFormTrigger);
    map.closePopup();
  }
});

// Функция эмулирующая событие "Change" в фильтре
function emulateChangeEvent() {
  const changeEvent = new Event('change');
  filterContainer.dispatchEvent(changeEvent);
}

// Хендлер на кнопки 'Купить' и 'Продать'
btnBuySellContainer.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (evt.target === buyButton || evt.target === sellButton) {
    activateBuyOrSellBtn();
    map.closePopup();
    tableRender(contractors);
    emulateChangeEvent();
  }
});


setUserFormSubmit();

export {
  getDataOnStart,
  emulateChangeEvent,
  commonIcon,
  starIcon,
  map,
  contractors,
  user
};

