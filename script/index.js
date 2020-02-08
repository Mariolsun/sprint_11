const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  },
  {
    name: 'Нургуш',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg'
  },
  {
    name: 'Тулиновка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg'
  },
  {
    name: 'Остров Желтухина',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg'
  },
  {
    name: 'Владивосток',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg'
  }
];

const sectionToAppend = document.querySelector('.root');
const placesBlock = document.querySelector('.places-list');

const openAddFormBtn = document.querySelector('.user-info__button_type_add');
const openEditFormBtn = document.querySelector('.user-info__button_type_edit');

const userName = document.querySelector('.user-info__name');
const userInfo = document.querySelector('.user-info__job');
const userAvatar = document.querySelector('.user-info__photo');

const userProfile = {
  name: userName,
  info: userInfo,
  avatar: userAvatar
}

const cardTemplate = document.getElementById('place-card');
const addPopupTemplate = document.getElementById('popup_type_add');
const editPopupTemplate = document.getElementById('popup_type_edit');
const imagePopupTemplate = document.getElementById('popup_type_image');
const popupAvatarTemplate = document.getElementById('popup_type_avatar');

const validationMessages = {
  required: 'Это обязательное поле',
  incorrectLength: 'Должно быть от 2 до 30 символов',
  invalidUrl: 'Здесь должна быть ссылка'
};




const cardList = new CardList(placesBlock);


const validation = new Validation(validationMessages);



const popupEdit = new PopupEdit(editPopupTemplate, sectionToAppend, validation);
const popupAvatar = new PopupAvatar(popupAvatarTemplate, sectionToAppend, validation);
const popupImage = new PopupImage(imagePopupTemplate, sectionToAppend);


openEditFormBtn.addEventListener('click', popupEdit.open);
userAvatar.addEventListener('click', popupAvatar.open);

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort6',
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  }
});



const popupCard = new PopupCard(api, addPopupTemplate, sectionToAppend, validation);
popupCard.addCard = cardList.addCard.bind(cardList);
openAddFormBtn.addEventListener('click', popupCard.open);

api.getUserProfile()
   .then(user => {
     ;
     popupEdit.renderUser(user);
   })
   .catch(e => console.log(`Error: ${e}`));


api.getInitialCards()
   .then(cards => {
     
     cards.forEach(card => {
      
       let newCard = new Card(cardTemplate, card);
       
       cardList.addCard(newCard);
     });
    })
   .catch(e => console.log(`Error: ${e}`));


popupEdit.block.addEventListener('submit', function(event) {
  event.preventDefault();
  popupEdit.renderLoading(true);
  api.editProfile(popupEdit.nameInput.value, popupEdit.infoInput.value)
     .then(user => {
      popupEdit.renderUser(user);
      popupEdit.close(event);
     })
     .catch(e=> console.log(`Error: ${e}`))
     .finally(()=>popupEdit.renderLoading(false));
});


  
popupCard.block.addEventListener('submit', function(event) {
  event.preventDefault();
  popupCard.renderLoading(true);
  api.addCard(popupCard.nameInput.value, popupCard.linkInput.value)
     .then (card => {
       cardList.addCard(new Card(cardTemplate, card));
       popupCard.close(event);
     })
     .catch(e => console.log(`Error: ${e}`))
     .finally(()=>popupCard.renderLoading(false));
});


cardList.container.addEventListener('click', function(event) {
  
  let clickedCard = cardList.findCard(event.target.closest('.place-card'));
  
  if (event.target.classList.contains('place-card__like-icon')) {
    api.likeCard(clickedCard.json._id, clickedCard.isLiked(userId))
       .then(card => {
         clickedCard.render(card);
       })
       .catch(e => console.log(`Error: ${e}`));
  };
  if (event.target.classList.contains('place-card__delete-icon')) {
    if(confirm('Вы действительно хотите удалить эту карточку?')) {

    api.deleteCard(clickedCard.json._id)
       .then( ()=> {
        clickedCard.elem.remove();
        delete cardList.cards[cardList.cards.indexOf(clickedCard)];
       })
       .catch(e => console.log(`Error: ${e}`));
    };
  }
});


popupAvatar.block.addEventListener('submit', function(event) {
  event.preventDefault();
  popupAvatar.renderLoading(true);
  api.updateAvatar(popupAvatar.linkInput.value)
    .then(() => {
      userAvatar.style.backgroundImage = `url(${popupAvatar.linkInput.value})`;
      popupAvatar.close(event);
    })
    .catch(e => console.log(`Error: ${e}`))
    .finally(()=> popupAvatar.renderLoading(false));

})


/*
  Хорошая работа:
  - класс Api только обменивается с сервером и
  сам не изменяет страницу возвращая из своих методов промисы
  - помимо обязательных запросов сделаны также запросы из дополнительной части задания
  - адрес сервера передается в конструктор класса Api

  Но есть и некоторые замечания:
  
  Надо исправить:
  - при запросах likeCard и deleteCard проблемы с обработкой ошибок - блок catch должен
  располагаться в конце цепочки ***сделано***

  Можно лучше:
  - проверку ответа сервера и преобразование из json можно вынести отдельным методом чтобы не дублировать ***сделано***

*/

/*
  Замечания исправлены

  Можно лучше: т.к. метод getResponseData не используется вне класса лучше пометить его как приватный добавив 
  в начале символ подчеркивания _getResponseData 

  Если у Вас будет свободное время попробуйте изучить работу с сервером
  с использованием async/await для работы с асинхронными запросами.
  https://medium.com/@stasonmars/%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%B5-%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5-%D1%81%D0%B8%D0%BD%D1%85%D1%80%D0%BE%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-%D0%B8-%D0%B0%D1%81%D0%B8%D0%BD%D1%85%D1%80%D0%BE%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-javascript-%D1%81-async-await-ba5f47f4436

  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  Это часто используется в реальной работе

  Успехов в дальнейшем обучении!
*/
