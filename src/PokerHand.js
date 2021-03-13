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