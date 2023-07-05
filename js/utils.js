const submitButton = document.querySelector('#buy-submit-btn');
const containerLoadError = document.querySelector('#load-error-container');
const containerUserProfile = document.querySelector('.user-profile');
const containerMain = document.querySelector('#main-container');
const containerEmptyData = document.querySelector('#empty-data-container');


//Функция показа контейнера с сообщением об ошибке загрузки
function showLoadAlert() {
  containerUserProfile.style.cssText = 'display: none';
  containerMain.style.cssText = 'display: none';
  containerLoadError.style.cssText = 'display: block';
  containerEmptyData.style.cssText = 'display: none';
}

//Функция показа контейнера с сообщением об ошибке загрузки
function showEmptyAlert() {
  containerUserProfile.style.cssText = 'display: flex';
  containerMain.style.cssText = 'display: none';
  containerLoadError.style.cssText = 'display: none';
  containerEmptyData.style.cssText = 'display: block';
}

//Функция удаления контейнера с сообщением об ошибке загрузки
function removeAlerts() {
  containerUserProfile.style.cssText = 'display: flex';
  containerMain.style.cssText = 'display: block';
  containerLoadError.style.cssText = 'display: none';
  containerEmptyData.style.cssText = 'display: none';
}

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
  showLoadAlert,
  showEmptyAlert,
  removeAlerts,
  blockSubmitButton,
  unblockSubmitButton,
  isEscapeKey
};

