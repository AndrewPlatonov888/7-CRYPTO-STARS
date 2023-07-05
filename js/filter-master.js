import { contractors } from './main.js';
import { deleteRenderedPoints, renderPoints } from './map-render.js';
import { isSaleBtnActive, tableRender } from './list-render.js';

const DEBOUNCE_TIMEOUT_DELAY = 500; // 500 миллисекунд
const filterContainer = document.querySelector('.custom-toggle');

let isEmptyAlert;


//Функция поучения всех чекнутых чекбоксов (возвращает массив)
function getCheckedCheckBoxes() {
  const checkboxesList = document.querySelectorAll('#checked-users');
  const checkedCheckboxes = [];
  for (let index = 0; index < checkboxesList.length; index++) {
    if (checkboxesList[index].checked) {
      checkedCheckboxes.push(checkboxesList[index].value); // все значения чекнутых боксов кладем в массив
    }
  }
  return checkedCheckboxes;
}

// Функция установки хендлера на чекбокс/чекбоксы и сама функция фильтрации
function setFilteringMenusChange(callback) {
  filterContainer.addEventListener('change', () => {
    deleteRenderedPoints();
    let newcontractors = contractors;
    const checkboxesValues = getCheckedCheckBoxes();
    if (checkboxesValues.length > 0) {
      newcontractors = contractors.filter((res) => res.isVerified !== undefined); // отсеиваем всеx без ключа isVerified
      for (let i = 0; i <= checkboxesValues.length - 1; i++) {
        if (checkboxesValues[i] === 'on') {
          newcontractors = newcontractors.filter((res) => res.isVerified);
        }
      }
    }
    isEmptyAlert = false;
    if (newcontractors.length === 0){
      isEmptyAlert = true;
    }
    tableRender(newcontractors);
    if (isSaleBtnActive()) { // Блокируем отображение на карте поинтов-продавцов, при включенной кнопке "Продать"
      newcontractors = [];
    }
    callback(newcontractors);
  });
}

//Подарочная функция от Кекса для устранения дребезга
function debounce(callback, timeoutDelay) {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId); // Перед каждым новым вызовом удаляем предыдущий таймаут, чтобы они не накапливались
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay); // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
}

//Функция активации фильтра
function activateFilter() {
  setFilteringMenusChange(debounce(renderPoints, DEBOUNCE_TIMEOUT_DELAY));
}


export {
  activateFilter,
  setFilteringMenusChange,
  debounce,
  getCheckedCheckBoxes,
  filterContainer,
  isEmptyAlert
};
