import "./style.css";
import Card from "../script/Card.js";
import Api from "../script/Api.js";
import CardList from "../script/CardList.js";
import PopupCard from "../script/PopupCard.js";
import PopupEdit from "../script/PopupEdit.js";
import PopupImage from "../script/PopupImage.js";
import PopupAvatar from "../script/PopupAvatar.js";
import PopupSignin from "../script/PopupSignin.js";
import Validation from "../script/validation.js";





const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTgzOWQ3ZjY4MTVhOTJlYzQ3NGJlZTIiLCJpYXQiOjE1ODU4MjM1NzgsImV4cCI6MTU4NjQyODM3OH0.DjAEDcMS6HY0zorksE9-QmWSYWsg0R9FgVreIAKzBjg';

const sectionToAppend = document.querySelector('.root');
const placesBlock = document.querySelector('.places-list');

const openAddFormBtn = document.querySelector('.user-info__button_type_add');
const openEditFormBtn = document.querySelector('.user-info__button_type_edit');
const openSigninBtn = document.querySelector('.user-info__button_type_signin');
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
const signinTemplate = document.getElementById('popup_type_signin');
const validationMessages = {
  required: 'Это обязательное поле',
  incorrectLength: 'Должно быть от 2 до 30 символов',
  invalidUrl: 'Здесь должна быть ссылка'
};

console.log(`cookie: ${document.cookie}`);


const cardList = new CardList(placesBlock);


const validation = new Validation(validationMessages);



const popupEdit = new PopupEdit(editPopupTemplate, sectionToAppend, validation);
const popupAvatar = new PopupAvatar(popupAvatarTemplate, sectionToAppend, validation);
const popupImage = new PopupImage(imagePopupTemplate, sectionToAppend);
const popupSignin = new PopupSignin(signinTemplate, sectionToAppend, validation);


const api = new Api({
  baseUrl: 'https://api.mesto.website',
  headers: {
    'Content-Type': 'application/json'
  }
});



const popupCard = new PopupCard(api, addPopupTemplate, sectionToAppend, validation);
popupCard.addCard = cardList.addCard.bind(cardList);


api.getInitialData()
   .then(data => {
     if(data.user) {
       console.log('rendering authorized user page');
       openEditFormBtn.addEventListener('click', popupEdit.open);
       userAvatar.addEventListener('click', popupAvatar.open);
       openAddFormBtn.addEventListener('click', popupCard.open);
       popupEdit.renderUser(data.user)
     } else {
       console.log('addin eventlistener to signin button');
       openSigninBtn.addEventListener('click', popupSignin.open);
     }

     console.log(`index.js recieved initial info: ${typeof data}`);
     data.cards.forEach(card => {
      
      let newCard = new Card(cardTemplate, card);
      
      cardList.addCard(newCard);
    });
   })
   .catch(e => console.log(`Error: ${e}`));


/*
api.getInitialCards()
   .then(cards => {
     console.log(`index.js getting initial cards: ${JSON.stringify(cards)}`);
     cards.data.forEach(card => {
      
       let newCard = new Card(cardTemplate, card);
       
       cardList.addCard(newCard);
     });
    })
   .catch(e => console.log(`Error: ${e}`));

*/
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
    api.likeCard(clickedCard.json._id, clickedCard.isLiked('ea1bff16927c3a7237205010'))
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



