import Popup from './PopupV2.js';

export default class PopupSignin extends Popup {
  constructor(template, destination, validation) {
    super(template, destination);
    this.validation = validation;
    this.block.classList.add('popup_type_signin');
    this.userValid = validation.isLengthOK.bind(this.validation);

    this.emailInput = this.block.querySelector('.popup__input_type_email');
    this.passwordInput = this.block.querySelector('.popup__input_type_password');

    this.submitBtn = this.block.querySelector('.popup__button');
    this.emailAlert = this.block.querySelector('.popup__validate-alert_type_email');
    this.passwordAlert = this.block.querySelector('.popup__validate-alert_type_password');

    this.open = this.open.bind(this);
    this.render = this.render.bind(this);
    this.renderUser = this.renderUser.bind(this);

    this.block.addEventListener('input', this.render);
  }

  open(event) {

    
   //this.render(event);


    super.open(event);

  }

  close(event) {
    this.emailAlert.style.visibility = 'hidden';
    this.passwordAlert.style.visibility = 'hidden';
    super.close(event);
  }
  
  renderUser(user) {
    this.userName.textContent = user.name;
    this.userInfo.textContent = user.about;
    this.userAvatar.style.backgroundImage = `url(${user.avatar})`;
  }


  render(event) {

    let result = {
      email: this.userValid(this.emailInput.value),
      password: this.userValid(this.passwordInput.value)
    }

    this.buttonRender(this.submitBtn,  result.email === '' && result.password === ''); //рендер кнопки

    switch (event.target) {
      case this.emailInput:
        this.alertRender(this.emailAlert, result.email); //рендер текста ошибки в первом поле
        break;
      case this.passwordInput:
        this.alertRender(this.passwordAlert, result.password); //рендер текста ошибки во втором поле
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