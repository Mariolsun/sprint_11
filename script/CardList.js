export default class CardList {
  constructor(domElement) {
    this.container = domElement;
    this.cards = [];
  }

  render(cards) {
    cards.forEach((card) => {
      this.addCard(card);
    });
  }

  addCard(card) {
    this.cards.push(card);
    this.container.appendChild(card.elem);
  }

  findCard(cardElem) {
    let res;
    this.cards.forEach(card => {
      if(card.elem == cardElem) {res = card;}
     
    });
    return res;
  }

  deleteCard(card) {
    this.container.remove(card.elem);
  }

}
