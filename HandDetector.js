class HandDetector {
  static get VERSION() {
    return '0.1';
  }

  static getAllRanks() {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  }
  static convertCardsToRank(cards) {
    return cards.map(card => card.rank);
  }

  static isOurOwnPair(gameState) {
    var allCards = this.getAllPlayingCards(gameState);
    var allCurrentRanks = allCards.map(card => card.rank);
    
    var myHand = this.getMyHand(gameState);
    var myRanks = this.convertCardsToRank(myHand);

    var firstPair = false;
    var secondPair = false;
    var firstPairingRank = false;
    var secondPairingRank = false;
    if (allCurrentRanks.filter(rank => rank === myRanks[0]).length === 2) {
      firstPair = true;
      firstPairingRank = myRanks[0];
    }
    if (allCurrentRanks.filter(rank => rank === myRanks[0]).length === 2) {
      secondPair = true;
      secondPairingRank = myRanks[0];
    }
    if (firstPair) {
      return {
        isPair: true,
        pairingRank: firstPairingRank
      };
    }
    if (secondPair) {
      return {
        isPair: true,
        pairingRank: secondPairingRank
      };
    }
  }

  static getAllPlayingCards(gameState) {
    var allCards = this.getCommunityCards(gameState);
    var playerCards = this.getMyHand(gameState);
    allCards.push(playerCards[0]);
    allCards.push(playerCards[1]);
    return allCards;
  }
  static getMyPlayer(gameState) {
    return gameState["players"][gameState["in_action"]];
  }

  static getMyHand(gameState) {
    return this.getMyPlayer(gameState).hole_cards;
  }

  static getCommunityCards(gameState) {
    if (!gameState.community_cards) {
      console.log("Community cards NOT available");
      return [];
    }
    return gameState.community_cards;
  }
}

module.exports = HandDetector;


/*
 * {
 "tournament_id":"550d1d68cd7bd10003000003",     // Id of the current tournament
 
 "game_id":"550da1cb2d909006e90004b1",           // Id of the current sit'n'go game. You can use this to link a
 // sequence of game states together for logging purposes, or to
 // make sure that the same strategy is played for an entire game
 
 "round":0,                                      // Index of the current round within a sit'n'go
 
 "bet_index":0,                                  // Index of the betting opportunity within a round
 
 "small_blind": 10,                              // The small blind in the current round. The big blind is twice the
 //     small blind
 
 "current_buy_in": 320,                          // The amount of the largest current bet from any one player
 
 "pot": 400,                                     // The size of the pot (sum of the player bets)
 
 "minimum_raise": 240,                           // Minimum raise amount. To raise you have to return at least:
 //     current_buy_in - players[in_action][bet] + minimum_raise
 
 "dealer": 1,                                    // The index of the player on the dealer button in this round
 //     The first player is (dealer+1)%(players.length)
 
 "orbits": 7,                                    // Number of orbits completed. (The number of times the dealer
 //     button returned to the same player.)
 
 "in_action": 1,                                 // The index of your player, in the players array
 
 "players": [                                    // An array of the players. The order stays the same during the
 {                                           //     entire tournament
 
 "id": 0,                                // Id of the player (same as the index)
 
 "name": "Albert",                       // Name specified in the tournament config
 
 "status": "active",                     // Status of the player:
 //   - active: the player can make bets, and win the current pot
 //   - folded: the player folded, and gave up interest in
 //       the current pot. They can return in the next round.
 //   - out: the player lost all chips, and is out of this sit'n'go
 
 "version": "Default random player",     // Version identifier returned by the player
 
 "stack": 1010,                          // Amount of chips still available for the player. (Not including
 //     the chips the player bet in this round.)
 
 "bet": 320                              // The amount of chips the player put into the pot
 },
 {
 "id": 1,                               
 "name": "Bob",
 "status": "active",
 "version": "Default random player",
 "stack": 1590,
 "bet": 80,
 "hole_cards": [                        
 
 {
 "rank": "6",                  
 "suit": "hearts"                
 },
 {
 "rank": "K",
 "suit": "spades"
 }
 ]
 },
 {
 "id": 2,
 "name": "Chuck",
 "status": "out",
 "version": "Default random player",
 "stack": 0,
 "bet": 0
 }
 ],
 "community_cards": [
 {
 "rank": "4",
 "suit": "spades"
 },
 {
 "rank": "A",
 "suit": "hearts"
 },
 {
 "rank": "6",
 "suit": "clubs"
 }
 ]
 }
 */