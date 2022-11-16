class Player {
  static get VERSION() {
    return '0.1';
  }

  static getMyPlayer(gameState) {
    return gameState["players"][gameState["in_action"]];
  }

  static getMyHand(gameState) {
    return this.getMyPlayer(gameState).hole_cards;
  }

  static getCommunityCards(gameState) {
    return gameState.community_cards;
  }

  static betRequest(gameState, bet) {
    try {
      const currentPlayerState = this.getMyPlayer(gameState);
      const ourCards = this.getMyHand(gameState);
      let currentBet = gameState["current_buy_in"] - currentPlayerState["bet"];

      let matchingCards = ourCards[0].rank == ourCards[1].rank;
      let matchingSuite = ourCards[0].suit == ourCards[1].suit;

      //let addBet = 0;
      //let minumumRaise = gameState["minimum_raise"];
      if (matchingCards || matchingSuite) {
        currentBet = currentPlayerState["stack"];
      }

      bet(currentBet);
    } catch (err) {
      console.error("[ERROR] Fucked up", err);
      bet(0);
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
