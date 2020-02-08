export default class Api {
  constructor(options) {
    this.options = {
      headers: options.headers
    }
    this.baseUrl = options.baseUrl;
    

    this.editProfile = this.editProfile.bind(this);

  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, this.options)
      .then(res => {
        if(res.ok) {return res.json()}
        return Promise.reject(`Error: ${res}`)
      });
  }

  getUserProfile() {

    return fetch(`${this.baseUrl}/users/me`, this.options)
      .then(res => this._getResponseData(res));
  }

  editProfile(name, about) {

    this.options.body = JSON.stringify({
      name: name,
      about: about,
    })

    this.options.method = 'PATCH';
    return fetch(`${this.baseUrl}/users/me`, this.options)
      .then(res => this._getResponseData(res));
  }

  addCard(name, link) {
    this.options.body = JSON.stringify({
      name: name,
      link: link
    });
  
    this.options.method = 'POST';
    return fetch(`${this.baseUrl}/cards`, this.options)
            .then(res => this._getResponseData(res));
  }

  deleteCard(id) {
    
    this.options.method = 'DELETE'
    return fetch(`${this.baseUrl}/cards/${id}`, this.options)
            .then(res => this._getResponseData(res)); 
  }
  
  likeCard(id, isLiked) {
    if(isLiked) {this.options.method = 'DELETE'}
    if(!isLiked) {this.options.method = 'PUT'}
    return fetch(`${this.baseUrl}/cards/like/${id}`, this.options)
        .then(res => this._getResponseData(res));


  }

  updateAvatar(link) {
    this.options.method = 'PATCH';
    this.options.body = JSON.stringify({
      avatar: link
    });

    return fetch(`${this.baseUrl}/users/me/avatar`, this.options)
        .then(res => this._getResponseData(res));
  }

  /* Можно лучше: т.к. метод getResponseData не используется вне класса лучше пометить его как приватный добавив 
  в начале символ подчеркивания _getResponseData */
  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}
