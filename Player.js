class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    bet(gameState[current_buy_in] - gameState[players[in_action][bet]]);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
