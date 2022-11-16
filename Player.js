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

  static betRequest(gameState, bet) {
    try {
      const currentPlayerState = Player.getMyPlayer(gameState);
      const ourCards = Player.getMyHand(gameState);
      let placeBet = gameState["current_buy_in"] - currentPlayerState["bet"];
      let minumumRaise = gameState["minimum_raise"];
      let currentHandSign = Player.getPairSign(ourCards);

      if (Player.isPreFlop(gameState)) {
        let matchingCards = ourCards[0].rank == ourCards[1].rank;
        let matchingSuite = Player.areSameSuit(ourCards);

        if (matchingCards) {
          // pocket pair preflop
          placeBet = currentPlayerState["stack"];
        } else if (matchingSuite && ["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          // pocket Big suited connectors
          placeBet = currentPlayerState["stack"];
        } else if (["AK", "AQ", "AJ", "KQ", "KA", "QA", "JA", "QK"].includes(currentHandSign)) {
          // pocket big connectors - call until flop
          placeBet += minumumRaise;
        } else if (matchingSuite) {
          placeBet += minumumRaise;
        } else {
          bet(0);
        }
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
