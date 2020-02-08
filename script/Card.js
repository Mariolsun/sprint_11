export default class Card {
  constructor(template, properties) {
  
    this.elem = document.createElement('div');
    this.elem.classList.add('place-card');
    this.elem.append(template.content.cloneNode('true'));
    this.json = properties;
   

    this.image = this.elem.querySelector('.place-card__image');
    this.name = this.elem.querySelector('.place-card__name');
    this.likesAmount = this.elem.querySelector('.place-card__likes-amount');
    this.likeBtn = this.elem.querySelector('.place-card__like-icon');
    this.deleteBtn = this.elem.querySelector('.place-card__delete-icon');

    


    this.create = this.create.bind(this);

    this.render(this.json);
  }

  renderLike(bool) { //лайк
    if(bool) {this.likeBtn.classList.add('place-card__like-icon_liked')}
    else {this.likeBtn.classList.remove('place-card__like-icon_liked')}
  }

 

  isMine(id) {
    return id === this.json.owner._id;
  }

  renderDeleteBtn (bool) {
    if(bool) {this.deleteBtn.style.display = 'block'}
    else {this.deleteBtn.style.display = 'none'}
  }
  isLiked(userId) {
    let res = false;
    this.json.likes.forEach(like => {
      if (like._id === userId) {res = true};
    });
    return res;
  }
  create(name, link) {
    const newCard = new Card(name, link, this.template);
    return newCard.elem;
  }

  render(json) {
    this.json = json;
    this.image.style.backgroundImage = `url(${this.json.link})`;
    this.name.textContent = this.json.name;
    this.likesAmount.textContent = json.likes.length;
    this.renderLike(this.isLiked(userId));
    this.renderDeleteBtn(this.isMine(userId));
  }



}
