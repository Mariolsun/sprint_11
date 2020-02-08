import Popup from './PopupV2.js';

export default class PopupEdit extends Popup {
  constructor(template, destination, validation) {
    super(template, destination);
    this.validation = validation;
    this.userValid = validation.isLengthOK.bind(this.validation);
    this.userName = document.querySelector('.user-info__name');
    this.userInfo = document.querySelector('.user-info__job');

    this.nameInput = this.block.querySelector('.popup__input_type_username');
    this.infoInput = this.block.querySelector('.popup__input_type_userinfo');
    this.userAvatar = document.querySelector('.user-info__photo');

    this.submitBtn = this.block.querySelector('.popup__button');
    this.nameAlert = this.block.querySelector('.popup__validate-alert_type_username');
    this.infoAlert = this.block.querySelector('.popup__validate-alert_type_userinfo');

    this.open = this.open.bind(this);
    this.render = this.render.bind(this);
    this.renderUser = this.renderUser.bind(this);

    this.block.addEventListener('input', this.render);
  }

  open(event) {

    this.nameInput.value = this.userName.textContent;
    this.infoInput.value = this.userInfo.textContent;
    this.render(event);


    super.open(event);

  }

  close(event) {
    this.nameAlert.style.visibility = 'hidden';
    this.infoAlert.style.visibility = 'hidden';
    super.close(event);
  }
  
  renderUser(user) {
    this.userName.textContent = user.name;
    this.userInfo.textContent = user.about;
    this.userAvatar.style.backgroundImage = `url(${user.avatar})`;
  }


  render(event) {

    let result = {
      name: this.userValid(this.nameInput.value),
      info: this.userValid(this.infoInput.value)
    }

    this.buttonRender(this.submitBtn,  result.name === '' && result.info === ''); //рендер кнопки

    switch (event.target) {
      case this.nameInput:
        this.alertRender(this.nameAlert, result.name); //рендер текста ошибки в первом поле
        break;
      case this.infoInput:
        this.alertRender(this.infoAlert, result.info); //рендер текста ошибки во втором поле
        break;
    }

  }

  renderLoading(loading) {
    if(loading) {
      this.submitBtn.textContent = 'Загрузка...';
    } else {
      this.submitBtn.textContent = 'Сохранить';
    } 

  }
};