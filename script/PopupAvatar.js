import Popup from './PopupV2.js';



export default class PopupAvatar extends Popup {
  constructor(template, destination, validation) {
    super (template, destination);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.validation = validation;
    this.inputValid = validation.isUrlOK.bind(this.validation);
    
    this.linkInput = this.block.querySelector('.popup__input_type_link');
    this.submitBtn = this.block.querySelector('.popup__button');
    this.linkAlert = this.block.querySelector('.popup__validate-alert_type_link');
    this.form = this.block.querySelector('.popup__form');

    this.render = this.render.bind(this);
    this.close = this.close.bind(this);

    this.block.addEventListener('input', this.render);

  }

  open(event) {

    this.render(event);
    this.linkAlert.style.visibility = 'hidden';
    super.open(event);

  }


  close(event) {
    this.form.reset();
    super.close(event);
  }
  render(event) {
    console.log(`in render, this: ${this}, linkInput.value: ${this.linkInput.value}`)

    let result = this.inputValid(this.linkInput.value);

    this.buttonRender(this.submitBtn,  result === ''); //рендер кнопки
  
    this.alertRender(this.linkAlert, result); //рендер текста ошибки
      
    }



  

  renderLoading(loading) {
    if(loading) {
      this.submitBtn.textContent = 'Загрузка...';
    } else {
      this.submitBtn.textContent = 'Сохранить';
    } 

  }
}