//Results that are needed back
const Result = { "win": 1, "loss": 2, "tie": 3 };

//Poker hand function
const PokerHand = function(hand) {
    this.hand = hand;
    this.breakdown = {
        'numberBreakdown': getQuantityOfNumbers(hand),
        'consecutiveNumbers': checkConsecutiveNumbers(hand),
        'sameSuits': checkSameSuits(hand),
        'highCardIndex': validNumbers.indexOf(getHighCard(hand))
    };
};

PokerHand.prototype.compareWith = function(hand) {
    
    // No parameter given in function
    if(hand === undefined) {
        throw new Error('Please compare to another hand');
    }

    const player1 = new PokerHand(this.hand);
    const player2 = hand;

    // Get index of result in pokerRanks (lower score better)
    const p1Result = pokerRanks.indexOf(getResult(player1));
    const p2Result = pokerRanks.indexOf(getResult(player2));

    // If both players only have high card, compare cards
    if(p1Result === 9 && p2Result === 9) {
        if(player1.breakdown.highCardIndex > player2.breakdown.highCardIndex) {
            message = 'Player1 Wins!';
            return Result.win;
        } else if(player1.breakdown.highCardIndex < player2.breakdown.highCardIndex) {
            message = 'Player1 Lost!';
            return Result.loss;
        } else {
            message = 'Draw';
            return Result.tie
        }

    // Else compare pokerRanks index (lower score wins)
    } else if(p1Result < p2Result) {
        message = 'Player2 Wins!';
        return Result.win;
    } else if (p1Result > p2Result) {
        message = 'Player2 Lost!';
        return Result.loss;
    } else if (p1Result === p2Result) {
        message = 'Draw';
        return Result.tie
    } else {
        throw new Error('Error: cannot compare hands');
    }
};

/* DECLARE CONSTANTS */

const validNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const pokerRanks = [
    'Royal flush',
    'Straight flush',
    '4 of a kind',
    'Full house',
    'Flush',
    'Straight',
    '3 of a kind',
    'Two pairs',
    'Pair',
    'High card',
]

// Example hands for testing, uncomment to use in browser console
// const sampleHandRoyal = new PokerHand('AS KS TS QS JS'); // Royal flush
// const sampleHandStrFlush = new PokerHand('3S 5S 7S 6S 4S'); // Straight flush
// const sampleHandFour = new PokerHand('AS AD AC AH JS'); // 4 of a kind
// const sampleHandFull = new PokerHand('QS 2D 2C QS QH'); // Full house
// const sampleHandFlush = new PokerHand('2S 4S 6S QS JS'); // Flush
// const sampleHandStr = new PokerHand('4S 5C 7H 8S 6D'); // Straight
// const sampleHandThree = new PokerHand('4H 4C 4S 2H JS'); // 3 of a kind
// const sampleHand2Pair = new PokerHand('7D 7C 3S TD TH'); // Two Pairs
// const sampleHand1Pair = new PokerHand('AS AH 5D 2S 3C'); // Pair
// const sampleHandHighCard = new PokerHand('AS 8D TS 3C 5H'); // High card



/* HELPER FUNCTIONS */

// Get card numbers contained in hand
function getHandDenominations(cards) {
    return cards.map(ele => ele[0]).sort();
}

// Get suits contained in hand
function getHandSuits(cards) {
    return cards.map(ele => ele[1]).sort();
}


/* FUNCTIONS TO POPULATE HAND OBJECT */

// Create object showing breakdown of cards denominations in hand
function getQuantityOfNumbers(hand) {
    let cardDenoms = {};
    
    getHandDenominations(hand.split(' ')).map(ele => {
        if(validNumbers.includes(ele)) {
            typeof cardDenoms[ele] === 'undefined' ? cardDenoms[ele] = 1 : cardDenoms[ele]++;    
        }
    })
    return cardDenoms;
}

// Check to see if card numbers are consecutive
function checkConsecutiveNumbers(hand) {
    let indexes = [];
    let consecutiveNumbers = true;

    getHandDenominations(hand.split(' ')).map(ele => {
        indexes.push(validNumbers.indexOf(ele));
    })

    const sortedIndexes = indexes.sort((a, b) => a - b);

    for(let i = 1; i < sortedIndexes.length; i++) {
        if(sortedIndexes[i - 1] != sortedIndexes[i] - 1) {
            consecutiveNumbers = false;
        }
    }
    return consecutiveNumbers;
}

// Check to see if all cards are the same suit
function checkSameSuits(hand) {
    const suitsInHand = getHandSuits(hand.split(' '));
    const suit = suitsInHand.shift();    
    let count = 0;

    suitsInHand.map(ele => {
        if(ele === suit) {
            count++;
        }
    })

    return count === 4 ? true : false;
}

// Get value of high card
function getHighCard(hand) {
    let highIndex = 0;

    getHandDenominations(hand.split(' ')).map(ele => {
        if(validNumbers.indexOf(ele) > highIndex) {
            highIndex = validNumbers.indexOf(ele);
        }
    })

    return validNumbers[highIndex];
}

// Get the result of the hand
function getResult(hand) {

    const denoms = getHandDenominations(hand.hand.split(' '));

    // Royal flush         A => 10 same suit
    if(denoms.includes('A')
        && hand.breakdown.consecutiveNumbers
        && hand.breakdown.sameSuits) {
            return pokerRanks[0];
    }

    // Straight flush      5 consecutive numbers same suit
    if(hand.breakdown.consecutiveNumbers
        && hand.breakdown.sameSuits) {
            return pokerRanks[1];
    }
    
    // Four of a kind      Four cards the same
    let duplicates = [];

    for (const prop in hand.breakdown.numberBreakdown) {
        if(hand.breakdown.numberBreakdown[prop] === 4) {
            return pokerRanks[2];
        } else {
            duplicates.push(hand.breakdown.numberBreakdown[prop]);   
        }        
    }

    // Full house          3 cards same denomination + a pair
    if((duplicates[0] === 3 && duplicates[1] === 2) || (duplicates[1] === 3 && duplicates[0] === 2)) {
        return pokerRanks[3];
    }

    // Flush               5 cards same suit  
    if(hand.breakdown.sameSuits) {
        return pokerRanks[4];
    }
    
    // Straight            Any 5 cards in sequence
    if(hand.breakdown.consecutiveNumbers) {
        return pokerRanks[5];
    }

    // Three of a kind     3 cards same denomination
    for (const prop in hand.breakdown.numberBreakdown) {
        if(hand.breakdown.numberBreakdown[prop] === 3) {
            return pokerRanks[6];
        }      
    }

    // Two pairs           2 sets of 2 cards same denomination
    // One Pair            2 cards same denomination
    let pairs = [];
    denoms.map((ele, i) => {
        if(denoms[i] === denoms[i + 1]) {
            pairs.push(denoms[i])
        }
    });
    
    if(pairs.length === 2) {
        return pokerRanks[7];
    } else if(pairs.length === 1) {
        return pokerRanks[8];
    }

    // Highest card if no other combination
    return pokerRanks[9];
}

/* Front end interface LOGIC */

let message;
const submitBtn = document.getElementById('submit-btn');


submitBtn.addEventListener('click', function() {
    
    let messageText = document.getElementById('message');
    let playerOneResult = document.getElementById('playerResult');
    let playerTwoResult = document.getElementById('oppoResult');   
    let playerOneHand, playerTwoHand;

    playerOneHand = new PokerHand(document.getElementById('player1').value);
    playerTwoHand = new PokerHand(document.getElementById('player2').value);

    playerOneResult.innerHTML = getResult(playerOneHand);
    playerTwoResult.innerHTML = getResult(playerTwoHand);

    playerOneHand.compareWith(playerTwoHand);

    messageText.innerHTML = message;

})
