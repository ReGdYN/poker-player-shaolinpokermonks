class HandDetector {
  static get VERSION() {
    return '0.1';
  }

  static weHaveHighCard(gameState) {
    var highCards = ["A", "K", "Q", "J"];
    var myHand = this.getMyHand(gameState);
    var myRanks = this.convertCardsToRank(myHand);
    if (highCards.indexOf(myRanks[0]) > -1) {
        return true;
    }
    if (highCards.indexOf(myRanks[1]) > -1) {
        return true;
    }
    return false;
  }
  static weHaveVeryHighCard(gameState) {
    var highCards = ["A", "K"];
    var myHand = this.getMyHand(gameState);
    var myRanks = this.convertCardsToRank(myHand);
    if (highCards.indexOf(myRanks[0]) > -1) {
        return true;
    }
    if (highCards.indexOf(myRanks[1]) > -1) {
        return true;
    }
    return false;
  }
  static amountOfPlayersOut(gameState) {
    var players = gameState.players;
    var playerStatuses = players.map(player => player.status);
    var playersOut = playerStatuses.filter(status => status === "out");
    return playersOut.length;
  }
  static amountOfPlayersActive(gameState) {
    var players = gameState.players;
    var playerStatuses = players.map(player => player.status);
    var playersActive = playerStatuses.filter(status => status === "active");
    return playersActive.length;
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

    console.log("All current ranks", allCurrentRanks);
    console.log("My ranks", myRanks);

    var firstPair = false;
    var secondPair = false;
    var firstPairingRank = false;
    var secondPairingRank = false;
    if (allCurrentRanks.filter(rank => rank === myRanks[0]).length === 2) {
      firstPair = true;
      firstPairingRank = myRanks[0];
    }
    if (allCurrentRanks.filter(rank => rank === myRanks[1]).length === 2) {
      secondPair = true;
      secondPairingRank = myRanks[1];
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
    return {
      isPair: false,
      pairingRank: false
    };
  }
  static isOurOwnTwoPairs(gameState) {
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
    if (allCurrentRanks.filter(rank => rank === myRanks[1]).length === 2) {
      secondPair = true;
      secondPairingRank = myRanks[1];
    }
    if (firstPair && secondPair) {
      return {
        isTwoPairs: true,
        firstPairingRank: firstPairingRank,
        secondPairingRank: secondPairingRank
      };
    }
    return {
      isTwoPairs: false,
      firstPairingRank: false,
      secondPairingRank: false
    };
  }
  static isOurOwnTrips(gameState) {
    var allCards = this.getAllPlayingCards(gameState);
    var allCurrentRanks = allCards.map(card => card.rank);

    var myHand = this.getMyHand(gameState);
    var myRanks = this.convertCardsToRank(myHand);

    var firstTrips = false;
    var secondTrips = false;
    var firstTripsRank = false;
    var secondTripsRank = false;
    if (allCurrentRanks.filter(rank => rank === myRanks[0]).length === 3) {
      firstTrips = true;
      firstTripsRank = myRanks[0];
    }
    if (allCurrentRanks.filter(rank => rank === myRanks[1]).length === 3) {
      secondTrips = true;
      secondTripsRank = myRanks[1];
    }
    if (firstTrips) {
      return {
        isTrips: true,
        tripsRank: firstTripsRank
      };
    }
    if (secondTrips) {
      return {
        isTrips: true,
        tripsRank: secondTripsRank
      };
    }
    return {
      isTrips: false,
      tripsRank: false
    };
  }

  static getAllPlayingCards(gameState) {
    var allCards = [...this.getCommunityCards(gameState)];
    var playerCards = this.getMyHand(gameState);
    return [...allCards, ...playerCards];
  }
  static getAllPlayingRanks(gameState) {
    return this.getAllPlayingCards(gameState).map(card => card.rank);
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