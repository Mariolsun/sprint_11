import Popup from './PopupV2.js';

export default class PopupCard extends Popup {
  constructor(api,template, destination, validation) {
    super(template, destination);
    this.api = api;
    this.block.classList.add('popup_type_add');
    this.validation = validation;
    this.nameValid = validation.isLengthOK.bind(this.validation);
    this.linkValid = validation.isUrlOK.bind(this.validation);

    this.nameInput = this.block.querySelector('.popup__input_type_name');
    this.linkInput = this.block.querySelector('.popup__input_type_link-url');
    this.submitBtn = this.block.querySelector('.popup__button');
    this.nameAlert = this.block.querySelector('.popup__validate-alert_type_name');
    this.linkAlert = this.block.querySelector('.popup__validate-alert_type_link-url');
    this.form = this.block.querySelector('.popup__form');

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.render = this.render.bind(this);

    this.block.addEventListener('input', this.render); 
  }

  render(event) {

    let result = {
      name: this.nameValid(this.nameInput.value),
      link: this.linkValid(this.linkInput.value)
    }
    

    this.buttonRender(this.submitBtn, result.name === '' && result.link === '');

    switch (event.target) {
      case this.nameInput:
        this.alertRender(this.nameAlert, result.name); //рендер текста ошибки в первом поле
        break;
      case this.linkInput:
        this.alertRender(this.linkAlert, result.link); //рендер текста ошибки во втором поле
        break;
    }

  }

 

  close(event) {
    this.form.reset();
    this.render(event);
    super.close(event);

  }

  open(event) {
    this.nameAlert.style.visibility = 'hidden';
    this.linkAlert.style.visibility = 'hidden';
    super.open(event);
  }

  renderLoading(loading) {
    if(loading) {
      this.submitBtn.textContent = 'Загрузка...';
    } else {
      this.submitBtn.textContent = '+';
    } 
  }


};

