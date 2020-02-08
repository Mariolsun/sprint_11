class PopupCard extends Popup {
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

class PopupEdit extends Popup {
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

class PopupImage extends Popup {
  constructor(template, destination) {
    super(template, destination);

    this.image = this.block.querySelector('.popup__image');
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    destination.addEventListener('click', this.open);
  };

  close(event) {
    this.image.setAttribute('src', '#');
    this.block.classList.remove('popup_is-opened');
  }

  open(event) {
    if (event.target.classList.contains('place-card__image')) {
      this.image.setAttribute('src', event.target.style.backgroundImage
        .replace('url("', '')
        .replace('")', ''));

      this.block.classList.add('popup_is-opened');
    }
  }
};


class PopupAvatar extends Popup {
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