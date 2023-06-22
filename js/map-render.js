import { commonIcon, starIcon, map } from './main.js';

const mapMarkers = [];
const mapContainer = document.querySelector('.map').parentElement;
const userList = document.querySelector('.users-list');
const mapButton = document.querySelector('#map-btn');
const listButton = document.querySelector('#list-btn');

// Функция: прячет карту
function hideMap() {
  mapContainer.style.cssText = 'z-index: -1; position: absolute; top: 0';
}

// Функция: прячет карту и показывает таблицу
function hideMapShowList() {
  mapContainer.style.cssText = 'z-index: -1; position: absolute; top: 0';
  userList.style.cssText = 'display: block';
  mapButton.classList.toggle('is-active');
  listButton.classList.toggle('is-active');
}

// Функция: показыает карту и прячет таблицу
function showMapHideList() {
  mapContainer.style.cssText = '';
  userList.style.cssText = 'display: none';
  mapButton.classList.toggle('is-active');
  listButton.classList.toggle('is-active');
}


// Функция генерации HTML-кода для вывода списка платежных систем
function createPaymentsList(optionsList) {
  let list = '';
  for (let i = 0; i < optionsList.length; i++) {
    list = list.concat(`${'<li class="user-card__badges-item badge">'}${optionsList[i].provider}${'</li>'}`);
  }
  return list;
}

//Функция отрисовки отдельной карточки отдельного объявления
function pointRender(pointInfo) {
  const pointTemplate = document.querySelector('#map-baloon__template').content.querySelector('.user-card');
  const pointElement = pointTemplate.cloneNode(true);
  if (!pointInfo.isVerified) {
    pointElement.querySelector('#verified-point').remove();
  }
  pointElement.querySelector('#name-point').textContent = pointInfo.userName;
  pointElement.querySelector('#currency-point').textContent = pointInfo.balance.currency;
  pointElement.querySelector('#exchangerate-point').textContent = pointInfo.exchangeRate;
  pointElement.querySelector('#cashlimit-point').textContent = pointInfo.balance.amount;
  if (pointInfo.status === 'seller') {
    pointElement.querySelector('#payments-point').innerHTML = createPaymentsList(pointInfo.paymentMethods);
  } else {
    pointElement.querySelector('#payments-point').innerHTML = '';
  }
  return pointElement;
}

//Функция отрисовки точек на карте
function renderPoints(list) {
  // Локальная функция проверки наличия 'Cash in Person' среди доступных вариантов платежа
  function isCashIncluded(value) {
    return value.paymentMethods.includes('Cash in Person');
  }
  // Локальная функция проверки статуса продавца
  function isSeller(value) {
    return value.status.includes('seller');
  }
  const filteredList = list.filter((line) => line.coords && line.paymentMethods && isCashIncluded && isSeller);
  for (let i = 0; i <= filteredList.length - 1; i++) {
    let currentIcon = commonIcon;
    if (filteredList[i].isVerified) {
      currentIcon = starIcon;
    }
    const lat = filteredList[i].coords.lat;
    const lng = filteredList[i].coords.lng;
    const marker = L.marker({ lat, lng }, {
      icon: currentIcon,
    });
    mapMarkers.push(marker); //  Add marker to this.mapMarker for future reference
    marker
      .addTo(map)
      .bindPopup(pointRender(filteredList[i]));
  }
}

//Функция удаления отрисованных точек на карте
function deleteRenderedPoints() {
  mapMarkers.forEach((point) => {
    point.remove();
  });
}


export {
  pointRender,
  renderPoints,
  deleteRenderedPoints,
  hideMapShowList,
  showMapHideList,
  hideMap
};
