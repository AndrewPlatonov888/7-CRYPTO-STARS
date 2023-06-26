const alertContainer = document.createElement('div');
const submitButton = document.querySelector('#buy-submit-btn');

//Функция показа сообщения об ошибке
const showAlert = (message) => {
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'yellow';
  alertContainer.style.color = 'red';
  alertContainer.classList.add = 'alert__container';
  alertContainer.textContent = message;
  document.body.append(alertContainer);
};

//Функция удаления сообщения об ошибке
const removeAlert = () => {
  alertContainer.remove();
};

//Функция проверки нажатия на ESC
const isEscapeKey = (evt) => evt.key === 'Escape';

//Функция блокировки кнопки submit после отправки
const blockSubmitButton = () => {
  submitButton.disabled = true;
};

//Функция разблокировки кнопки submit после отправки
const unblockSubmitButton = () => {
  submitButton.disabled = false;
};

export {
  // shuffleRange,
  // getRandomInteger,
  // getRandomArrayElement,
  // getSet,
  showAlert,
  removeAlert,
  blockSubmitButton,
  unblockSubmitButton,
  // roundHundred,
  isEscapeKey
};

