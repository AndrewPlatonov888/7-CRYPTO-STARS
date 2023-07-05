import { getCheckedCheckBoxes } from './filter-master.js';
import { isMapBtnActive } from './map-render.js';
import { showEmptyAlert } from './utils.js';

const sellButton = document.querySelector('#sell-btn');

// Функция генерации HTML-кода для вывода списка платежных систем
function createPaymentsList(optionsList) {
  let list = '';
  for (let i = 0; i < optionsList.length; i++) {
    list = list.concat(`${'<li class="users-list__badges-item badge">'}${optionsList[i].provider}${'</li>'}`);
  }
  return list;
}

//Универсальная функция отрисовки строки в таблице
function rowRender(contractor) {
  const adTemplate = document.querySelector('#user-table-row__template').content.querySelector('.users-list__table-row');
  const adElement = adTemplate.cloneNode(true);
  if (!contractor.isVerified) {
    adElement.querySelector('#verified').remove();
  }
  adElement.querySelector('#name').textContent = contractor.userName;
  adElement.querySelector('#currency').textContent = contractor.balance.currency;
  adElement.querySelector('#exchangerate').textContent = contractor.exchangeRate;
  adElement.querySelector('#cashlimit').textContent = contractor.balance.amount;
  if (contractor.status === 'seller') {
    adElement.querySelector('#payments').innerHTML = createPaymentsList(contractor.paymentMethods);
  } else {
    adElement.querySelector('#payments').innerHTML = '';
  }
  adElement.querySelector('.btn--greenborder').setAttribute('id', `${contractor.id}`);
  return adElement;
}

///Функция проверки активирована ли кнопка "Продать"
function isSaleBtnActive() {
  return sellButton.classList.contains('is-active');
}


////Функция отрисовки таблицы
function tableRender(contractorsList) {
  if (contractorsList.length === 0 && !isMapBtnActive()) { // если массив с данными пустой - показываем сообщение emptyAlert
    showEmptyAlert();
  }
  let newcontractorsList = contractorsList;
  if (isSaleBtnActive()) {
    newcontractorsList = newcontractorsList.filter((res) => res.status === 'buyer'); // отсеиваем всеx не продавцов
  } else {
    newcontractorsList = newcontractorsList.filter((res) => res.status === 'seller'); // отсеиваем всеx не покупателей
  }
  const checkboxesValues = getCheckedCheckBoxes();
  if (checkboxesValues.length > 0) {
    newcontractorsList = newcontractorsList.filter((res) => res.isVerified !== undefined); // отсеиваем всеx без ключа isVerified
    for (let i = 0; i <= checkboxesValues.length - 1; i++) {
      if (checkboxesValues[i] === 'on') {
        newcontractorsList = newcontractorsList.filter((res) => res.isVerified);
      }
    }
  }
  const contractorsTable = document.querySelector('.users-list__table-body');
  contractorsTable.innerHTML = '';
  for (let i = 0; i < newcontractorsList.length; i++) {
    contractorsTable.appendChild(rowRender(newcontractorsList[i]));
  }
}

export {
  rowRender,
  tableRender,
  isSaleBtnActive
};
