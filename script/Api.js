
export default class Api {
  constructor(options) {
    this.options = {
      headers: options.headers
    }
    this.baseUrl = options.baseUrl;
    

    this.editProfile = this.editProfile.bind(this);

  }
    
  getInitialData() {
    this.options.authorization = this._getToken();
    return fetch(`${this.baseUrl}/pageload`, this.options)
      .then(res => {
        console.log(`fetching initial data ${res.status}`);
        console.log(`api.js res.headers: ${JSON.stringify(res.headers)}`);
        if(res.ok) {
          console.log(`all ok: ${res.status}`);
          return res.json();
        }
        return Promise.reject(`Error: ${res}`)
      });
  }

  getUserProfile() {
    this.options.authorization = this._getToken();
    return fetch(`${this.baseUrl}/users/me`, this.options)
      .then(res => this._getResponseData(res));
  }

  editProfile(name, about) {
    this.options.authorization = this._getToken();
    this.options.body = JSON.stringify({
      name: name,
      about: about,
    })

    this.options.method = 'PATCH';
    return fetch(`${this.baseUrl}/users/me`, this.options)
      .then(res => this._getResponseData(res));
  }

  addCard(name, link) {
    this.options.authorization = this._getToken();
    this.options.body = JSON.stringify({
      name: name,
      link: link
    });
  
    this.options.method = 'POST';
    return fetch(`${this.baseUrl}/cards`, this.options)
            .then(res => this._getResponseData(res));
  }

  deleteCard(id) {
    this.options.authorization = this._getToken();
    this.options.method = 'DELETE'
    return fetch(`${this.baseUrl}/cards/${id}`, this.options)
            .then(res => this._getResponseData(res)); 
  }
  
  likeCard(id, isLiked) {
    this.options.authorization = this._getToken();
    if(isLiked) {this.options.method = 'DELETE'}
    if(!isLiked) {this.options.method = 'PUT'}
    return fetch(`${this.baseUrl}/cards/like/${id}`, this.options)
        .then(res => this._getResponseData(res));


  }

  updateAvatar(link) {
    this.options.authorization = this._getToken();
    this.options.method = 'PATCH';
    this.options.body = JSON.stringify({
      avatar: link
    });

    return fetch(`${this.baseUrl}/users/me/avatar`, this.options)
        .then(res => this._getResponseData(res));
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _getToken() {
    return localStorage.getItem('token');
  }
}
