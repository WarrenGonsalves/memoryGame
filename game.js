console.log("start")
const deck = () => {
  const names = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const suits = ['Hearts','Diamonds','Spades','Clubs'];
  const deckOfCards = names.map(name => suits.map(suit => {
        return {
          name: name,
          suit: suit
        }
      })
  )
  .reduce((tempDeck, card) => tempDeck.concat(card));

  let currentDeck = [];
  let selectedCards = [];
  let score = 0;
  const genDeck = () => {
    let numberOfCards = 10;
    currentDeck = [];
    if(document.getElementById('easy-rd').checked) {
      numberOfCards = 10;
    }else if(document.getElementById('medium-rd').checked) {
      numberOfCards = 20;
    }else if(document.getElementById('hard-rd').checked) {
      numberOfCards = 40;
    }else if(document.getElementById('night-rd').checked) {
      numberOfCards = 52;
    }
    let tempDeck = deckOfCards.slice();
    console.log("deckOfCards: "+deckOfCards.length)
    for (let i = 0; i < numberOfCards; i++) {
      let index = Math.floor(Math.random() * tempDeck.length);
      currentDeck.push(tempDeck[index]);
      currentDeck.push(tempDeck[index]);
      tempDeck.splice(index, 1);
    }
    // paint();
  }
  const shuffle = () => {
    let shuffeledDeck = [];
    for (var card of currentDeck) {
      let index = Math.floor(Math.random() * shuffeledDeck.length);
      shuffeledDeck.splice(index, 0, card)
    }
    currentDeck = shuffeledDeck;
    paint();
  }

  const getDeck = () => currentDeck;

  const toggleCardVisibility = (card, bool) => {
    if (bool) {
      card.querySelector(".name").classList.add("show");
      card.querySelector(".suit").classList.add("show");  
    } else {
      card.querySelector(".name").classList.remove("show");
      card.querySelector(".suit").classList.remove("show");
    }
    
  }

  const updateScore = () => {
    console.log("you scored a point!");
    score++;
    document.getElementById("currentScore").innerHTML = score;

  }

  const compareSelectedCards = () => {
    let card1 = selectedCards[0];
    let card2 = selectedCards[1];
    if (card1.getAttribute('value') == card2.getAttribute('value')) {
      updateScore();
      makeUsed(card1.id, card2.id);
    }
  }

  const makeUsed = (id1, id2) => {
    currentDeck[id1].used = true;
    currentDeck[id2].used = true;
    let finished = currentDeck.reduce((flag, card) => {
      console.log(flag, card.used);
      return flag && card.used;
    }, true);
    if(finished){
      let boardDiv = document.getElementById("board");
      var gameOverDiv = document.createElement('div');
      gameOverDiv.className = "game-over";
      gameOverDiv.innerHTML = '<span>You Won!!!</span>';
      boardDiv.appendChild(gameOverDiv);
    };
  }

  const clearSelected = () => {
    if (selectedCards.length >= 2){ 
      // console.log(currentDeck[selectedCards[0].id].used, currentDeck[selectedCards[1].id].used)
      if (!currentDeck[selectedCards[0].id].used && !currentDeck[selectedCards[1].id].false) {
        toggleCardVisibility(selectedCards[0], false);
        toggleCardVisibility(selectedCards[1], false);
      }
      selectedCards = [];
    }
  }
  const addToSelected = (card) => {
    clearSelected();
    if (selectedCards.length < 2) {
      if (selectedCards.length == 1 && selectedCards[0].id == card.id)
        return;
      selectedCards.push(card);
      toggleCardVisibility(card, true);
      // console.log(selectedCards);
      if (selectedCards.length == 2) 
        compareSelectedCards();
      return true;
    }
  }

  const cardClicked = (e) => {
    let target = e.target;
    if (target !== e.currentTarget){  //If board is selected ignore
      if (target.nodeName == "SPAN")  //select parent if span is clicked
        if (target.parentElement.className == "card") {
          target = target.parentElement;
        } else return;
      if (target.className != "card") 
        return;
      addToSelected(target);
      
      var clickedItem = target.getAttribute('value');
      // console.log("Hello " + clickedItem);
    }
    e.stopPropagation();
  }

  const paint = () => {
    if (document.getElementById("board"))
      document.getElementById("board").remove();
    let boardDiv = document.createElement('div');
    boardDiv.setAttribute('id', 'board');
    let count = 0;
    console.log("currentDeck: "+currentDeck.length);
    for(var card of currentDeck) {
      let div = document.createElement("div");
      let clicked = 0;
      let previousCards = [];

      let ascii;
      card.id = count;
      div.className = "card";
      div.setAttribute('value', card.name + card.suit);
      div.setAttribute('id', count++);

      if(card.suit == 'Diamonds') {
        ascii = "&diams;";
      } else {
        ascii = "&" + card.suit.toLowerCase() + ';';
      }
      card.id = count;
      div.innerHTML = '<span class="name">' + card.name + '</span><span class="suit">' + ascii + '</span>';
      boardDiv.appendChild(div);
    }
    let gameDiv = document.getElementById("memory-game");
    gameDiv.appendChild(boardDiv);
    boardDiv.addEventListener("click", cardClicked, false)
    // paintControls();
  }

  const paintControls = () => {
    if (document.getElementById("game-controls"))
      document.getElementById("game-controls").remove();
    let gameDiv = document.getElementById("memory-game");
    var scoreDiv = document.createElement('div');
    scoreDiv.setAttribute("id", "game-controls");
    scoreDiv.classList.add("game-controls");
    scoreDiv.innerHTML = '<span class="score"><small>Score: </small><span id="currentScore">' + score + '</span></span>'+
                          '<button id="start-button">Start</button>'+
                          '<span class="radio-group">'+
                          '<input class="radio-input" type="radio" id="easy-rd" name="radio-category" checked/><label class="radio-label" for="easy-rd">Easy <small>(10 pairs)</small></label>'+
                          '<input class="radio-input" type="radio" id="medium-rd" name="radio-category"/><label class="radio-label" for="medium-rd">Medium <small>(20 pairs)</small></label>'+
                          '<input class="radio-input" type="radio" id="hard-rd" name="radio-category"/><label class="radio-label" for="hard-rd">Hard <small>(40 pairs)</small></label>'+
                          '<input class="radio-input" type="radio" id="night-rd" name="radio-category"/><label class="radio-label" for="night-rd">Hard <small>(52 pairs)</small></label>'+
                          '</span>';

    gameDiv.appendChild(scoreDiv);
    document.getElementById("start-button").addEventListener("click", (e) => {
      // e.target.disabled = true;
      genDeck();
      shuffle();
    }, false)
  }

  return {
    deckOfCards,
    genDeck,
    shuffle,
    getDeck,
    paintControls
  };
}

const deck1 = deck();
deck1.paintControls();
// deck1.genDeck();
// deck1.shuffle();














// let card = function(name, suit, value){
//   this.name = name;
//   this.suit = suit;
//   this.value = value;
// };

// var deck = function(){
//   var _cards = [];
//   this.names = ['1','2','3','4','5','6','7','8','9','10','J','Q','K'];
//   this.suits = ['Hearts','Diamonds','Spades','Clubs'];
//   this.init = function(){
//     for(var i=0;i<4;i++){
//        for(var j=0;j<13;j++){
//         _cards.push(new card(this.names[j],this.suits[i], (j+1)*(i+1)));
//        }
//     }
//   };
//   this.printCards = function(){
//     console.log(_cards);

//   };

//   this.removeByValue = function(value) {

//     for (var i = 0; i < _cards.length; i++) {

//         if(_cards[i].value == value) {
//           delete _cards[i];
//         }
//     }
//   };

//   this.draw = function(){
//     //console.log(_cards.length);
//     for (var i = 0; i < _cards.length; i++) {
//       var div = document.createElement("div");

//       var clicked = 0;
//       var previousCards = [];

//       div.addEventListener("click", function(event){

//         if(clicked < 2) {

//           //show this card
//           this.querySelector(".name").classList.add("show");
//           this.querySelector(".suit").classList.add("show");

//           // add this card to previous cards
//           previousCards[clicked] = this;

//           console.log(previousCards);

//           if (clicked == 1) {
//             var scoreid = "score-"+ turn;

//             //console.log(scoreid);

//             if(previousCards[0].querySelector(".name").innerHTML == previousCards[1].querySelector(".name").innerHTML && previousCards[0].querySelector(".suit").innerHTML == previousCards[1].querySelector(".suit").innerHTML) {
//               players[turn].score += 100;
//               document.getElementById(scoreid).innerHTML = players[turn].score;
//                 var val1 = previousCards[0].getAttribute("data-row");
//                 var val2 = previousCards[1].getAttribute("data-row");
//                 this.removeByValue(val1);
//                 this.removeByValue(val2);
//                 previousCards[0].remove();
//                 previousCards[1].remove();
//               // console.log(_cards);
//               //playerWin(players[turn].name);
//             } else if(previousCards[0].querySelector(".name").innerHTML == previousCards[1].querySelector(".name").innerHTML) {
//               players[turn].score += 10;
//               document.getElementById(scoreid).innerHTML = players[turn].score;

//             } else {
//                 //switch turn
//                 if(turn == 0) {
//                   turn = 1;
//                   turnDiv.innerHTML = '<div> The current turn is for: ' + players[1].name + '</div>';
//                 } else if(turn == 1){
//                   turn = 0;
//                   turnDiv.innerHTML = '<div> The current turn is for: ' + players[0].name + '</div>';
//                 }

//             }
//           }

//         } else {
//           //show the new card
//           this.querySelector(".name").classList.add("show");
//           this.querySelector(".suit").classList.add("show");

//           //remove previous cards
//           previousCards[0].querySelector(".name").classList.remove("show");
//           previousCards[0].querySelector(".suit").classList.remove("show");
//           previousCards[1].querySelector(".name").classList.remove("show");
//           previousCards[1].querySelector(".suit").classList.remove("show");

//           //add current card to previousCards
//           previousCards[0] = this;

//           //setup click for zero
//           clicked = 0;

//           console.log(turn);

//         }

//         //console.log(previousCards);
//         clicked++;

//       });

//       var ascii;
//       div.className = "card";
//       div.setAttribute('data-row', _cards[i].value);

//       if(_cards[i].suit == 'Diamonds') {
//         ascii = "&diams;";
//       } else {
//         ascii = "&" + _cards[i].suit.toLowerCase() + ';';
//       }

//       div.innerHTML = '<span class="name">' + _cards[i].name + '</span><span class="suit">' + ascii + '</span>';
//       document.body.appendChild(div);
//     }
//   };

//   this.shuffle = function() {
//     for (var i = 0; i < _cards.length; i++) {
//       var a = _cards[i];
//       var b = parseInt(Math.random() * _cards.length);
//       _cards[i] = _cards[b];
//       _cards[b] = a;
//     }
//   };

// };

// var myDeck = new deck();
// myDeck.init();
// myDeck.init();

// // var muDeck = new deck();
// // muDeck.init();
// //
// // function shuffleBig(cards1, cards2){
// //   var fullDeck = [];
// //   fullDeck.push(cards1);
// //
// // }
// //shuffleBig(deck1, deck2);
// myDeck.printCards();
// myDeck.shuffle();
// myDeck.draw();