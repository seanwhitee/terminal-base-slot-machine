// The step to complete the project.
// 1. deposit some money
// 2. determine the line user bet on
// 3. Collect a bet amount
// 4. spin the slot machine
// 5. Give user money if they won, or take the money if they lost
// 6. play again or something else

// require the module "prompt-sync" and access the function we need to get the user input
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// javascript es6 arrow
const deposit = () => {
    while (true) {
        
    
        // notice: the default type that prompt return is a string
        const depositAmount = prompt("Enter a deposit amount: ");

        // convert the string user input to the float type
        const numberDepositAmount = parseFloat(depositAmount);

        // handle the wrong user input
        // if the user input is string or less than 0, we should let the user input the amount again.
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid, please enter deposit amount again. ");
        } else {
            return numberDepositAmount;
        }
    }
};

// Get numbers of lines user want to bet on.
const getNumberOfLines = () => {
    while (true) {
        
    
        // notice: the default type that prompt return is a string
        const lines = prompt("Enter a number of lines to bet on (1-3): ");

        // convert the string user input to the float type
        const numberOfLines = parseFloat(lines);

        // handle the wrong user input
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid, please enter number of lines to bet on again. ");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, line) => {
    while (true) {
        
    
        // notice: the default type that prompt return is a string
        const bet = prompt("Enter a number of bet per line: ");

        // convert the string user input to the float type
        const numberBet = parseFloat(bet);

        // handle the wrong user input
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / line) {
            console.log("Invalid, please enter number of bet again. ");
        } else {
            return numberBet;
        }
    }
};

// spin the slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    const reel = [];
    
    for (let i = 0; i < COLS; i++) {

        // to create the 2d array like [[], [], []].
        // if the COLS is 3. 
        reel.push([]);

        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            
            const randomIndex = Math.floor( Math.random() * reelSymbols.length );
            reel[i].push(reelSymbols[randomIndex]);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reel;
};

// transpos the array into the correct format
// for example
// if we have the array like [["A", "B", "C"], ["D", "D", "D"], ["C", "B", "A"]]
// we want them to be [["A", "D", "C"], ["B", "D", "B"], ["C", "D", "A"]]
const transpose = (reel) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reel[j][i]);
        }
    }
    return rows;
};  

const printSlotMachine = (reel) => {
    for (let i = 0; i < ROWS; i++) {
        let rowString = "";
        for (let j = 0; j < COLS; j++) {
            rowString += reel[i][j];
            if (j !== COLS - 1) {
                rowString += "|";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (slotMachine, bet, lines) => {
    let winnings = 0;
    
    for (let row = 0; row < lines; row++) {
        let allSame = true;
        for (let i = 0; i < slotMachine[row].length - 1; i++) {
            if (slotMachine[row][i] !== slotMachine[row][i+1]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[slotMachine[row][0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("Your current balance is " + balance);
        const numberOfLines = getNumberOfLines();
        const numberOfBet = getBet(balance, numberOfLines);
        balance -= numberOfBet * numberOfLines;
        const reel = spin();
        // console.log(reel);
        const newReel = transpose(reel);
        // console.log(newReel);
        printSlotMachine(newReel);
        getWinnings(newReel, numberOfBet, numberOfLines);
        const winnings = getWinnings(newReel, numberOfBet, numberOfLines);
        balance += winnings;
        console.log("You won $" + winnings.toString() + ".");

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)");
        if (playAgain !== "y") break;
    }
    
};


game();