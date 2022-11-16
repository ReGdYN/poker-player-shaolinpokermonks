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

  static betRequest(gameState, bet) {
    const currentPlayerState = Player.getMyPlayer(gameState);
    const ourCards = Player.getMyHand(gameState);

    let matchingCards = ourCards[0].rank == ourCards[1].rank;
    let matchingSuite = ourCards[0].suit == ourCards[1].suit;

    let currentBet = gameState["current_buy_in"] - currentPlayerState["bet"];

    //let addBet = 0;
    //let minumumRaise = gameState["minimum_raise"];
    if (matchingCards || matchingSuite) {
      currentBet = currentPlayerState["stack"];
    }

    bet(currentBet);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
