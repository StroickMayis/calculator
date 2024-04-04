/* 
TODO : I think all that is left is to make the text fit the display screen. I need to figure out all of round and shit. Will probably have to ctrl+f and find all of the spots where I set the display, and fix it to the odin project's rounding and text wrapping specifications. One option for this too, is to just do it in the set display.. possibly???

TODO : Also, I need make the buttons glow for the operators.
*/
const buttons = document.querySelector(`#buttons`);
const display = document.querySelector(`#display`);
const divideButton = document.querySelector(`#divideButton`);
const addButton = document.querySelector(`#addButton`);
const multiplyButton = document.querySelector(`#multiplyButton`);
const subtractButton = document.querySelector(`#subtractButton`);
const oneButton = document.querySelector(`#oneButton`);
const zeroButton = document.querySelector(`#zeroButton`);
const equalsButton = document.querySelector(`#equalsButton`);
const percentButton = document.querySelector(`#percentButton`);
let input = [];
let operant = null;
let result = null;
let operator = null;
let operatorQueue = null;
let equalsClicked = false;
let opCount = 0;
let clearClicked = false;
let posOrNeg = false;
let posOrNegAfterOpSwitch = false;
let previousClick = [];

setDisplay(0);

function calculate(operator, a, b) {
        switch (operator) {
            case "/":
                if (b == 0) {
                    return `Stop trying to crash my calculator...`;
                }
                return a / b;
            break;
            case "*":
                return a * b;
            break;
            case "-":
                return a - b;
            break;
            case "+":
                return a + b;
            break;
        }
}

function clearInput() {
    input = [];
}

function arrOfStrToNum(array) {
    let num = array.join(``);
    num = Number(num);
    return num;
}

function storeInputAsNumTo(destination) {
    if (input !== 0) {
        destination = input;
        destination = arrOfStrToNum(destination);
        return destination;
    }
}

function clearOperators() {
    if (operators[operators.length - 1] == `=`) {
        return operators.pop();
    }
}

function setDisplay(x) {
    display.textContent = `${x}`;
}

function runEqualsLogic() {
    // unhighlights any highlighted operators
    highlightOperator();
    // Displays error if you only click operators and then hit equals
    if ((operator || operatorQueue) && (input.length == 0 && operant == null && result == null)) {
        display.textContent = `ERROR`;

    // Equals functionality if you keep pressing it over and over again
    } else if ((!(result !== null && operatorQueue) && input.length == 0) && (operant  !== null && operator !== null )) {
        if (!result) {
            result = operant;
        }
        operant = calculate(operator, operant, result);
        setDisplay(operant);

    // All other functionality
    } else if (operant !== null && operator && input.length !== 0) {
        result = storeInputAsNumTo(result);
        clearInput();
        operant = calculate(operator, operant, result);
        setDisplay(operant);
    } else {
        result = storeInputAsNumTo(result);
        clearInput();
        operant = calculate(operator, operant, result);
        setDisplay(operant);
    }
    equalsClicked = false;
    posOrNegAfterOpSwitch = false;
}

function runNumberClickLogic() {
    highlightOperator();

    if (previousClick[0] == `=`) {
        operant = storeInputAsNumTo(operant);
        clearInput();
        setDisplay(operant); 
    } else {
        if (posOrNeg) {
            if (input.length == 0 && operant !== null && result !== null && !posOrNegAfterOpSwitch) {
                operant *= -1;
                setDisplay(operant);
            } else if (input.length == 0 && operant !== null && result !== null ) {
                if (input[0] !== "-") {
                    input.splice(0,0,"-")
                } else {
                    input.shift();
                }
                if (input.length == 0 || (input.length == 1 && input.includes(`-`))) {
                    setDisplay(`${input.join(``)}0`);
                } else {
                    setDisplay(input.join(``)); 
                }
            } else {
                if (input[0] !== "-") {
                    input.splice(0,0,"-")
                } else {
                    input.shift();
                }
                if (input.length == 0 || (input.length == 1 && input.includes(`-`))) {
                    setDisplay(`${input.join(``)}0`);
                } else {
                    setDisplay(input.join(``)); 
                }
            }
            posOrNeg = false;
        } else {
            if (input.length == 0) {
                setDisplay(`${input.join(``)}0`);
            } else {
                setDisplay(input.join(``)); 
            }
        }
    }
}

function runOperatorLogic() {
    if (operant !== null && result !== null && operator && operatorQueue && input.length !== 0) {
        result = storeInputAsNumTo(result);
        operant = calculate(operator, operant, result); 
        clearInput();
        result = null;
        queueNextOperator();
        
    } else if (operant !== null ) {

        // Triggers if input has something in it
        if (input.length !== 0) {

            result = storeInputAsNumTo(result);
            clearInput();
            operant = calculate(operator, operant, result);
            queueNextOperator();

        // Triggers if no input    
        } else {
            if (operatorQueue && operator) {
                queueNextOperator();
            } else {
                operant = calculate(operator, operant, result);
            }
        }
    } else {
        operant = storeInputAsNumTo(operant);
        clearInput();
        queueNextOperator();
    }  
    setDisplay(operant);
}

function clearCalculator() {
    input = [];
    operant = null;
    result = null;
    operator = null;
    operatorQueue = null;
    equalsClicked = false;
    opCount = 0;
    clearClicked = false;
    posOrNeg = false;
    posOrNegAfterOpSwitch = false;
    previousClick = [];
    console.clear();
    setDisplay(`0`);
    highlightOperator();
}

function logAllVars(beforeCalc) {
    if (beforeCalc) {
        opCount++;
        console.log(`OPERATION #: ${opCount} (BEFORE CALC)`);
        console.log(` `);
        console.log(`OPERANT : ${operant}`);
        console.log(`RESULT : ${result}`);
        console.log(`INPUT: ${input}`);
        console.log(`OPERATOR: ${operator}`);
        console.log(`OPERATOR QUEUE: ${operatorQueue}`);
        console.log(`EQUALS CLICKED?: ${equalsClicked}`);
        console.log(` `);
    } else {
        console.log(`OPERATION #: ${opCount} (AFTER CALC)`);
        console.log(` `);
        console.log(`OPERANT: ${operant}`);
        console.log(`RESULT: ${result}`);
        console.log(`INPUT: ${input}`);
        console.log(`OPERATOR: ${operator}`);
        console.log(`OPERATOR QUEUE: ${operatorQueue}`);
        console.log(`EQUALS CLICKED?: ${equalsClicked}`);
        console.log(` `);
    }
}

function queueNextOperator() {
    operator = operatorQueue;
    operatorQueue = null;
}

function highlightOperator(localOperator = null) {
    switch (localOperator) {
        case null:
            addButton.style.backgroundColor = null;
            divideButton.style.backgroundColor = null;
            multiplyButton.style.backgroundColor = null;
            subtractButton.style.backgroundColor = null;
        break;
        case "/":
            divideButton.style.backgroundColor = `rgb(70,70,70)`;
            addButton.style.backgroundColor = null;
            multiplyButton.style.backgroundColor = null;
            subtractButton.style.backgroundColor = null;
            
        break;
        case "*":
            multiplyButton.style.backgroundColor = `rgb(70,70,70)`;
            addButton.style.backgroundColor = null;
            divideButton.style.backgroundColor = null;
            subtractButton.style.backgroundColor = null;
            
        break;
        case "-":
            subtractButton.style.backgroundColor = `rgb(70,70,70)`;
            addButton.style.backgroundColor = null;
            divideButton.style.backgroundColor = null;
            multiplyButton.style.backgroundColor = null;
        break;
        case "+":
            addButton.style.backgroundColor = `rgb(70,70,70)`;
            divideButton.style.backgroundColor = null;
            multiplyButton.style.backgroundColor = null;
            subtractButton.style.backgroundColor = null;
        break;
    }
}

function checkPosOrNeg() {
    if (operator && operatorQueue) {
        posOrNegAfterOpSwitch = true;
    }
}

function updatePreviousClick(eventTarget) {
    if (eventTarget.className.includes(`num`)) {
        previousClick.push(`num`);
    } else {
        switch (eventTarget.id) {
            case `divideButton`:
                previousClick.push(`/`);
            break;
            case `multiplyButton`:
                previousClick.push(`*`);
            break;
            case `subtractButton`:
                previousClick.push(`-`);
            break;
            case `addButton`:
                previousClick.push(`+`);
            break;
            case `equalsButton`:
                previousClick.push(`=`);
            break;
            case `clearButton`:
                previousClick.push(`clear`);
            break;
            case `posOrNegButton`:
                previousClick.push(`posOrNeg`);
            break;
        }
    }
    if (previousClick.length > 2) {
        previousClick.shift();
    }
}

// *This is for the Percent Button, it clicks out "input /100 = to" by hand, this was my lazy solution.
const clickEvent = new MouseEvent(`click` , {bubbles:true,cancelable:true,view:window});
percentButton.addEventListener(`click`, () => {
        divideButton.dispatchEvent(clickEvent)
        oneButton.dispatchEvent(clickEvent)
        zeroButton.dispatchEvent(clickEvent)
        zeroButton.dispatchEvent(clickEvent)
        equalsButton.dispatchEvent(clickEvent)
});

buttons.addEventListener(`click`, (e) => {
    switch (e.target.id) {
        case `oneButton`:
            input.push(1);
        break;
        case `twoButton`:
            input.push(2);
        break;
        case `threeButton`:
            input.push(3);
        break;
        case `fourButton`:
            input.push(4);
        break;
        case `fiveButton`:
            input.push(5);
        break;
        case `sixButton`:
            input.push(6);
        break;
        case `sevenButton`:
            input.push(7);
        break;
        case `eightButton`:
            input.push(8);
        break;
        case `nineButton`:
            input.push(9);
        break;
        case `zeroButton`:
            input.push(0);
        break;
        case `dotButton`:
            if ( ! input.includes(`.`) ) {
                input.push(`.`);
            }
        break;

        case `divideButton`:
            operatorQueue =`/`;
            highlightOperator(`/`);
        break;
        case `multiplyButton`:
            operatorQueue =`*`;
            highlightOperator(`*`);
        break;
        case `subtractButton`:
            operatorQueue =`-`;
            highlightOperator(`-`);
        break;
        case `addButton`:
            operatorQueue =`+`;
            highlightOperator(`+`);
        break;
        case `equalsButton`:
            equalsClicked = true;
        break;
        case `clearButton`:
            clearClicked = true;
        break;
        case `posOrNegButton`:
            posOrNeg = true;
        break;
    }

    if (clearClicked) {
        clearCalculator();
    } else {
        updatePreviousClick(e.target);
        console.log(`PREVIOUS CLICK : ${previousClick[0]}`);
        console.log(` --- BUTTON CLICKED ---> ${e.target.id}`);
        logAllVars(true);
        checkPosOrNeg();
        if (e.target.className.includes(`num`)) {
            runNumberClickLogic();
        } else if (equalsClicked) {
            runEqualsLogic();
        } else if (operatorQueue) {
            runOperatorLogic();
        }
 
        if (!display.textContent) {
            setDisplay(0);
        }
        logAllVars(false);
        
    }
});