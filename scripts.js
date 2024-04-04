/* 
TODO : 9 / posOrNeg .  <--- reacts differently than iphone, misses the 0.

!!! CHECK PHONE VIDS FOR SHIT
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
const clearButton = document.querySelector(`#clearButton`);
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

function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
}

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
    let indexCounter;
    // *CONVERTS TO STRING
    if (typeof x !== `string`) {
        x = `${x}`;
    }

    // *CONVERTS TO EXPONENTIAL NOTATION IF TOO LONG
    Number(x); // !!! Could cause issues with error mesages.
    if (x.length > 9) {
        x = expo(x, 3);
    }

    // *SPLICES IN COMMAS FOR BIG NUMBERS
    x = x.split(``);
    if (x.length > 3 && !x.includes(`e`)) {
        if (x.includes(`.`)){
            indexCounter = x.indexOf(`.`);
            while (indexCounter > 3) {
                indexCounter -= 3;
                x.splice(indexCounter,0,`,`);
            } 
        } else {
            indexCounter = x.length;
            while (indexCounter > 3) {
                indexCounter -= 3;
                x.splice(indexCounter,0,`,`);
            }
        }   
    }
    // *CHANGES FONT SIZE FOR BIG NUMBERS
    if (x.length > 6) {
        switch (x.length) {
            case 7:
                display.style.fontSize = `13.5dvh`;
            break;
            case 8:
                display.style.fontSize = `11.75dvh`;
            break;
            case 9:
                display.style.fontSize = `10.5dvh`;
            break;
            default:
                display.style.fontSize = `9dvh`;
            break;
        }
    } else {
        display.style.fontSize = `15dvh`;
    }
    //* DISPLAYS TEXT
    display.textContent = `${x.join(``)}`;
    dotIndex = null;
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
    // If EVERYTHING is null
    } else if ((operator == null && operatorQueue == null && operant == null && result == null)){
        setDisplay(input.join(``));
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

    if ((previousClick[0] == `=`) && operator || operatorQueue) {
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
            addButton.style.color = null;
            divideButton.style.color = null;
            multiplyButton.style.color = null;
            subtractButton.style.color = null;
            addButton.style.backgroundColor = null;
            divideButton.style.backgroundColor = null;
            multiplyButton.style.backgroundColor = null;
            subtractButton.style.backgroundColor = null;
        break;
        case "/":
            divideButton.style.backgroundColor = `rgb(255,255,255)`;
            divideButton.style.color = `rgb(255,159,10)`;

            addButton.style.backgroundColor = null;
            addButton.style.color = null;
            multiplyButton.style.backgroundColor = null;
            multiplyButton.style.color = null;
            subtractButton.style.backgroundColor = null;
            subtractButton.style.color = null;
            
        break;
        case "*":
            multiplyButton.style.backgroundColor = `rgb(255,255,255)`;
            multiplyButton.style.color = `rgb(255,159,10)`;

            addButton.style.backgroundColor = null;
            addButton.style.color = null;
            divideButton.style.backgroundColor = null;
            divideButton.style.color = null;
            subtractButton.style.backgroundColor = null;
            subtractButton.style.color = null;
            
        break;
        case "-":
            subtractButton.style.backgroundColor = `rgb(255,255,255)`;
            subtractButton.style.color = `rgb(255,159,10)`;

            addButton.style.backgroundColor = null;
            addButton.style.color = null;
            divideButton.style.backgroundColor = null;
            divideButton.style.color = null;
            multiplyButton.style.backgroundColor = null;
            multiplyButton.style.color = null;
        break;
        case "+":
            addButton.style.backgroundColor = `rgb(255,255,255)`;
            addButton.style.color = `rgb(255,159,10)`;

            divideButton.style.backgroundColor = null;
            divideButton.style.color = null;
            multiplyButton.style.backgroundColor = null;
            multiplyButton.style.color = null;
            subtractButton.style.backgroundColor = null;
            subtractButton.style.color = null;
        break;
    }
}

function checkPosOrNeg() {
    if (operator && operatorQueue) {
        posOrNegAfterOpSwitch = true;
    }
}

function updatePreviousClick(eventTarget) {
    if (eventTarget.className.includes(`num`) || eventTarget.className.includes(`zeroNum`)) {
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

buttons.addEventListener("mousedown", (e) => 
{
    e.preventDefault();
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
        case `zeroButtonDiv`:
            if (!(input[0] === 0) && input.includes(`.`)){
                input.push(0);
            }
        break;
        case `zeroButton`:
            if (!(input[0] === 0) && input.includes(`.`)){
                input.push(0);
            }
        break;
        case `dotButton`:
            if ( (!(input.includes(`.`)) && (input.length == 0)) || (!(input.includes(`.`)) && (input[0] == `-`))) {
                input.push(`0`);
                input.push(`.`);
            } else if ( ! input.includes(`.`) ) {
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
        if (e.target.className.includes(`num`) || e.target.className.includes(`zeroNum`)) {
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
    if (input.length > 0 || result || operator) {
        console.log(input.length);
        clearButton.textContent = `C`;
    } else {
        clearButton.textContent = `AC`;
    }
});