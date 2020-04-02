import Popup from './PopupV2.js';


export default class PopupImage extends Popup {
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

