import "./style.css";
import Card from "../script/Card.js";
import Api from "../script/Api.js";
import CardList from "../script/CardList.js";
import PopupCard from "../script/PopupCard.js";
import PopupEdit from "../script/PopupEdit.js";
import PopupImage from "../script/PopupImage.js";
import PopupAvatar from "../script/PopupAvatar.js";
import Validation from "../script/validation.js";







const token = '84c86aad-d0d1-4ec9-91d9-06e6853e2cef';
const userId = 'ea1bff16927c3a7237205010';


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



