const HandDetector = require('./HandDetector');
const utils = require('./utils');

class Player {
  static get VERSION() {
    return '1.0';
  }

  static getMyPlayer(gameState) {
    return gameState["players"][gameState["in_action"]];
  }

  static getMyHand(gameState) {
    return Player.getMyPlayer(gameState).hole_cards;
  }

  static getCommunityCards(gameState) {
    return gameState.community_cards;
  }

  static isPreFlop(gameState) {
    return Player.getCommunityCards(gameState).length === 0;
  }

  static isFlop(gameState) {
    return Player.getCommunityCards(gameState).length === 3;
  }

  static isPreTurn(gameState) {
    return Player.getCommunityCards(gameState).length === 4;
  }

  static isPreRiver(gameState) {
    return Player.getCommunityCards(gameState).length === 5;
  }

  static getPairSign(cards) {
    return `${cards[0].rank}${cards[1].rank}`;
  }

  static areSameSuit(cards) {
    return cards[0].suit === cards[1].suit;
  }

  static areMatchingSign(cards) {
    return cards[0].rank === cards[1].rank;
  }

  static getSuiteCount(ourCards, communityCards) {
    let suits = {
      "hearts": 0,
      "spades": 0,
      "clubs": 0,
      "diamonds": 0
    };
    ourCards.forEach(card => {
      suits[card.suit]++;
    });
    communityCards.forEach(card => {
      suits[card.suit]++;
    });
    return suits;
  }

  static currentMaxMatchingSuits(ourCards, communityCards) {
    let currentSuits = Player.getSuiteCount(ourCards, communityCards);
    let maxCount = 0;

    Object.keys(currentSuits).forEach(key => {
      if (currentSuits[key] > maxCount) {
        maxCount = currentSuits[key];
      }
    });
    return maxCount;
  }

  static testStuff(gameState) {
    try {
      console.log("---- HAND DETECTOR ----");
      console.log("MY HAND:", Player.getMyHand(gameState));
      console.log("WHOLE CARD POOL:", HandDetector.getAllPlayingRanks(gameState));
      console.log("Pair Detector:", HandDetector.isOurOwnPair(gameState));
      console.log("Two Pairs Detector:", HandDetector.isOurOwnTwoPairs(gameState));
      console.log("---- HAND DETECTOR ----");
    } catch (err) {
      console.log("ERROR IN TESTING STUFF", err);
    }
  }

  static betRequest(gameState, bet) {

    Player.testStuff(gameState);
    console.log("GameState:", gameState);
    console.log("---- Starting Bet Request ----");
    try {
      const currentPlayerState = Player.getMyPlayer(gameState);
      const ourCards = Player.getMyHand(gameState);
      let placeBet = 0;
      let minimumRaise = gameState["minimum_raise"];
      let currentHandSign = Player.getPairSign(ourCards);

      let hasBeenRaised = gameState["current_buy_in"] > (gameState["small_blind"] * 2);
      let haveSingleHighCard = (currentHandSign.includes("A") || currentHandSign.includes("K") || currentHandSign.includes("Q"));

      let activePlayerCount = 0;
      gameState["players"].forEach((player) => {
        if (player.status == "active") {
          activePlayerCount++;
        }
      });

      console.log("Active players: ", activePlayerCount);

      if (Player.currentMaxMatchingSuits(ourCards, Player.getCommunityCards(gameState)) == 5) {
        console.log("---- FLUSH ----");
        // Flush - go all in no matter the step
        placeBet = currentPlayerState["stack"];
      } else if (Player.isPreFlop(gameState)) {
        console.log("---- PREFLOP ----");
        let matchingCards = Player.areMatchingSign(ourCards);
        let matchingSuite = Player.areSameSuit(ourCards);

        if (matchingCards) {
          console.log("---- PREFLOP: MATCHINGCARD ----");
          // pocket pair preflop
          if ((gameState["current_buy_in"] + minimumRaise) < 250) {
            placeBet = 250;
          } else {
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        } else if (matchingSuite && ["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          console.log("---- PREFLOP: 1 ----");
          // pocket Big suited connectors
          placeBet = currentPlayerState["stack"];
        } else if (["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          console.log("---- PREFLOP: 2 ----");
          // pocket big connectors - raise until flop
          if ((gameState["current_buy_in"] + minimumRaise) < 250) {
            placeBet = 250;
          } else if (gameState["current_buy_in"] <= (currentPlayerState["stack"] / 2)) {
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        } else if (["10A", "A10", "K10", "10K"].includes(currentHandSign)) {
          console.log("---- PREFLOP: 3 ----");
          // pocket semi-big connectors - raise by minimum bet until flop
          if (!hasBeenRaised) {
            console.log("---- PREFLOP: 3.5 ----");
            placeBet += minimumRaise;
          } else if (gameState["current_buy_in"] <= (currentPlayerState["stack"] / 4)) {
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        } else if (matchingSuite) {
          console.log("---- PREFLOP: 4 ----");
          if (gameState["current_buy_in"] <= 300) {
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        } else if (activePlayerCount <= 2 && haveSingleHighCard) {
          placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
        } else {
          console.log("---- PREFLOP: 5 ----");
        }
      } else {
        console.log("---- FLOP+ ----");

        const fullHand = utils.getFullHand(gameState);
        console.log('FULL HAND: ', fullHand);
        const handStrength = utils.getHandStrength(fullHand);
        console.log('HAND STRENGTH: ', handStrength);

        const ourCurrentBetSize = gameState["current_buy_in"];

        /*if (handStrength >= 7) {
          console.log("---- FLOP+: 1 ----");
          placeBet = currentPlayerState["stack"];
        } else */if (HandDetector.isOurOwnTrips(gameState).isTrips) {
          console.log("---- FLOP+: 2 ----");
          placeBet = currentPlayerState["stack"];
        } else if (HandDetector.isOurOwnTwoPairs(gameState).isTwoPairs) {
          console.log("---- FLOP+: 3 ----");
          if ((gameState["current_buy_in"] + minimumRaise) < 250) {
            placeBet = 250;
          } else {
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        } else if (HandDetector.isOurOwnPair(gameState).isPair) {
          console.log("---- FLOP+: 4 ----");
          if ((gameState["current_buy_in"] + minimumRaise) < 100) {
            placeBet = 100;
          } else if (ourCurrentBetSize < 300) {
            // Willing to go up to 300 with a single pair
            placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
          }
        }

        if (placeBet == 0 && gameState["current_buy_in"] <= 100 && haveSingleHighCard) {
          // Fold+ play along up to 50
          placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
        } else if (Player.isPreRiver(gameState) && (gameState["current_buy_in"] - currentPlayerState["bet"] == 0)) {
          // River - no raise, raise 50 ourselves
          placeBet = Math.max(50, minimumRaise);
        }
      }

      console.log("----- Placing Bet:", placeBet, " -------");

      bet(Math.min(placeBet, currentPlayerState["stack"]));
    } catch (err) {
      console.error("[ERROR] Fucked up", err);
      bet(0);
    }

  }

  static showdown(gameState) {
  }

}

module.exports = Player;
