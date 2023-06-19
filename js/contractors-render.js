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
  return adElement;
}

////Функция отрисовки таблицы
function tableRender(contractorsList) {
  const contractorsTable = document.querySelector('.users-list__table-body');
  for (let i = 0; i < contractorsList.length; i++) {
    contractorsTable.appendChild(rowRender(contractorsList[i]));
  }
}

export {
  rowRender,
  tableRender
};
