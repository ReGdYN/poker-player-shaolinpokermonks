class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    const currentPlayerState = gameState["players"][gameState["in_action"]];
    const ourCards = currentPlayerState["hole_cards"];

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
