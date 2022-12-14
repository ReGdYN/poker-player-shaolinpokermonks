function objectValues(obj) {
  const values = [];
  for (const property in obj) {
    values.push(obj[property]);
  }

  return values;
}

function getMyPlayer(gameState) {
  return gameState["players"][gameState["in_action"]];
}

function getMyHand(gameState) {
  return getMyPlayer(gameState).hole_cards;
}

function getCommunityCards(gameState) {
  return gameState.community_cards;
}

function getPairSign(cards) {
  return `${cards[0].rank}${cards[1].rank}`;
}

function areSameSuit(cards) {
  return cards.every(card => card.suit === cards[0].suit);
}

function sortHand(hand) {
  const copy = [...hand];
  copy.sort((a, b) => {
    let first = parseInt(a);
    let second = parseInt(b);

    if (isNaN(first)) {
      if (a === 'A') {
        first = 14;
      }
      if (a === 'K') {
        first = 13;
      }
      if (a === 'Q') {
        first = 12;
      }
      if (a === 'J') {
        first = 11;
      }
    }

    if (isNaN(second)) {
      if (b === 'A') {
        second = 14;
      }
      if (b === 'K') {
        second = 13;
      }
      if (b === 'Q') {
        second = 12;
      }
      if (b === 'J') {
        second = 11;
      }
    }

    return second - first;
  });

  return copy;
}

function getFullHand(gameState) {
  const myHand = getMyHand(gameState).map(card => card.rank);
  const communityHand = getCommunityCards(gameState).map(card => card.rank);

  const fullHand = sortHand([...myHand, ...communityHand]);

  return {
    hand: fullHand,
    ourHand: myHand,
    communityHand,
    fullHand: fullHand.join(""),
    isMatchingSuit: areSameSuit([...myHand, ...communityHand]),
  };
}

function getCounts(cards) {
  const counts = {};
  cards.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

  return counts;
}

function are4OfAKind(cards) {
  const counts = getCounts(cards);

  return objectValues(counts).find(count => count === 4);
}

function are3OfAKind(cards) {
  const counts = getCounts(cards);

  return objectValues(counts).find(count => count === 3);
}

function isFullHouse(cards) {
  const counts = getCounts(cards);
  let pair = false;
  let threes = false;

  objectValues(counts).forEach(count => {
    if (count === 2) {
      pair = true;
    }
    if (count === 3) {
      threes = true;
    }
  });

  return pair && threes;
}

function are2Pairs(cards) {
  const counts = getCounts(cards);
  let pair1 = 0;
  let pair2 = 0;

  objectValues(counts).forEach((count, index) => {
    if (count === 2) {
      pair1 = index + 1;
    }
    if (count === 2 && index !== pair1 - 1) {
      pair2 = index + 1;
    }
  });

  return pair1 && pair2;
}

function isAPair(cards) {
  const counts = getCounts(cards);
  let pair = false;

  objectValues(counts).forEach((count, index) => {
    if (count === 2) {
      pair = true;
    }
  });

  return pair;
}

function areConsecutive(array) {
  const arr = array.map(n => parseInt(n));
  let consecutive = true;

  arr.forEach((rank, index) => {
    if (index < arr.length - 2 && rank - arr[index + 1] !== 1) {
      consecutive = false;
    }
  });


  return consecutive;
}

function isDescending(arr) {
  return arr.every(function (x, i) {
    return i === 0 || x <= arr[i - 1];
  });
}

function getHandStrength(fullHand) {
  if (fullHand.hand === 'AKQJ10' && fullHand.isMatchingSuit) {
    return 10;
  }

  if (fullHand.isMatchingSuit && areConsecutive(fullHand.hand)) {
    return 9;
  }

  if (are4OfAKind(fullHand.hand)) {
    return 8;
  }

  if (isFullHouse(fullHand.hand)) {
    return 7;
  }

  if (fullHand.isMatchingSuit) {
    return 6;
  }

  if (isDescending(fullHand.hand)) {
    return 5;
  }

  if (are3OfAKind(fullHand.hand)) {
    return 4;
  }

  if (are2Pairs(fullHand.hand)) {
    return 3;
  }

  if (isAPair(fullHand.hand)) {
    return 2;
  }

  return 1;
}

module.exports = {
  getHandStrength,
  getFullHand,
};










