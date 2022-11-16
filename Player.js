class Player {
  static get VERSION() {
    return '0.1';
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

  static betRequest(gameState, bet) {
    try {
      const currentPlayerState = Player.getMyPlayer(gameState);
      const ourCards = Player.getMyHand(gameState);
      let placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
      let minumumRaise = gameState["minimum_raise"];
      let currentHandSign = Player.getPairSign(ourCards);

      let hasBeenRaised = gameState["current_buy_in"] > (gameState["small_blind"] * 2);

      if (Player.currentMaxMatchingSuits(ourCards, communityCards) == 5) {
        // Flush - go all in no matter the step
        placeBet = currentPlayerState["stack"];
      } else if (Player.isPreFlop(gameState)) {
        let matchingCards = Player.areMatchingSign(ourCards);
        let matchingSuite = Player.areSameSuit(ourCards);

        if (matchingCards) {
          // pocket pair preflop
          placeBet = currentPlayerState["stack"];
        } else if (matchingSuite && ["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          // pocket Big suited connectors
          placeBet = currentPlayerState["stack"];
        } else if (["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          // pocket big connectors - raise by minimum bet until flop
          if (!hasBeenRaised) {
            placeBet += minumumRaise;
          }
        } else if (matchingSuite) {
          if (!hasBeenRaised) {
            placeBet += minumumRaise;
          }
        } else {
          bet(0);
        }
      } else if (Player.isFlop(gameState)) {
        let communityCards = Player.getCommunityCards(gameState);
        
      }

      bet(Math.min(placeBet, currentPlayerState["stack"]));
    } catch (err) {
      console.error("[ERROR] Fucked up", err);
      bet(0);
    }

    this.testStuff(gameState);
  }

  static showdown(gameState) {
  }

  static testStuff(gameState) {
    try {
      console.log("MY HAND:", this.getMyHand(gameState));
      console.log("Pair Detector:", HandDetector.isOurOwnPair(gameState));
    } catch (err) {
      console.log("ERROR IN TESTING STUFF", err);
    }
  }
}

module.exports = Player;
