const operators = ["+", "-", "*", "/", "^"];

// Get a reference to all the input fields
const resultBar = document.querySelector('.result');
const historyBar = document.querySelector('.history');

// Get a reference to all the cells
const cells = document.querySelectorAll('.cell');

// Key name to access 'history' field in localStorage
const historyKeyName = "history";

const historyBtn = document.getElementById('history-btn');

const historySheet = document.querySelector('.history-sheet');

// Monotony will be broken once the user presses '=' or an operator
// If the monotony is broken, then the current character in the resultBar will be REPLACED
// by the latest character
let monotonyBreak = false;

// gotResult will be set to true as soon as the user presses '=' button
// If user has got the result, then when he/she will enter the new character, first both 
// the input fields will be cleared
let gotResult = false;

// Iterate through every cell
/*
    1. Get the textContent of the cell on which the user clicks
*/

// Function: Adds the expression to localStorage (history)
const addToHistory = expr => {
    // Fetch the history as an array
    let history = JSON.parse(localStorage.getItem(historyKeyName));

    // If there is no history, then initialize it with an empty array
    if(!history) history = [];

    // Add the expression to history
    history.unshift(expr);

    localStorage.setItem(historyKeyName, JSON.stringify(history));
}

cells.forEach(cell => cell.addEventListener('click', () => {
    // Get the value of current key pressed
    let char = cell.textContent;

    // If resultBar's value is 0, then make it empty so that the other characters 
    // don't concatenate with 0
    if(resultBar.textContent === "0"){
        resultBar.textContent = "";
    }

    // This will clear the current entry or resultBar
    if(char === "CE"){
        resultBar.textContent = "0";
        
        // Get out of the function so that 'CE' doesn't concatenates with rest of the 
        // characters
        return;
    }
    // This will clear all the inputs or both the bars
    else if(char === "C"){
        historyBar.textContent = "";
        resultBar.textContent = "0";

        // Get out of the function so that 'C' doesn't concatenates with rest of the 
        // characters
        return;
    }
    // This will clear the current character
    else if(char === "R"){
        resultBar.textContent = resultBar.textContent.substring(0, resultBar.textContent.length - 1);

        // If resultBar's value is empty, then make it zero to avoid EvalErrors in future
        if(resultBar.textContent === ""){
            resultBar.textContent = "0";
        }

        // Get out of the function so that 'R' doesn't concatenates with rest of the 
        // characters
        return;
    }
    else if(char === "÷"){
        // Change the character to / to avoid EvalError
        char = "/";
    }
    else if(char === "x"){
        // Change the character to * to avoid EvalError
        char = "*";
    }
    else if(char === "."){
        // Check if two (.) don't appear together
        if(/\.{1}/.test(resultBar.textContent)){
            resultBar.textContent = resultBar.textContent.slice(0, resultBar.textContent.length - 1);
        }
    }

    // If the current character is an operator and the last character of the resultBar's 
    // value is an operator, simply remove it because we will move it to historyBar
    if(operators.includes(char) && operators.includes(resultBar.textContent[resultBar.textContent.length - 1])){
        resultBar.textContent = resultBar.textContent.substring(0, resultBar.textContent.length - 1) + char;

        // Get out of the function to handle next iteration of the event
        return;
    }

    // If the user presses '='
    if(char === "="){
        gotResult = true;

        let historyExpr;    // Expression in the historyBar
        let resultExpr;     // Expression in the resultBar
        let mainExpr;       // Main expression formed after computation

        // If the resultBar's value is empty, then set it to 0
        if(resultBar.textContent === ""){
            resultBar.textContent = "0";
        }

        historyExpr = historyBar.textContent;
        resultExpr = resultBar.textContent;

        // If the last character of historyExpr is '=', then remove it to avoid errors
        if(historyExpr[historyExpr.length - 1] === "="){
            historyExpr = historyExpr.slice(0, historyExpr.length - 1);
        }

        // Replace '^' with '**' so that unwanted behavior can be prevented
        historyExpr = historyExpr.replace(/\^/g, "**");

        mainExpr = historyExpr + resultExpr;    

        resultBar.textContent = eval(mainExpr);

        // Replace '**' with '^' so that it doesn't seems unfamiliar to the user
        mainExpr = mainExpr.replace(/\*{2}/g, "^");

        // Add the '=' sign for fanciness
        historyBar.textContent = mainExpr + "=";

        addToHistory(historyBar.textContent + resultBar.textContent);

        // Get out of the function to handle next iteration
        return;
    }

    // If monotony is broken, then the current value of the resultBar will be replaced the
    // new input
    if(monotonyBreak){
        // Do not accept operators as they will lead to errors, simply change the sign
        // in the history bar
        if(!operators.includes(char)){
            resultBar.textContent = char;
            
            // Set the monotonyBreak to false to avoid further direct replacements
            monotonyBreak = false;
        }
        // To change the operator, simply replace the last character of historyBar with the 
        // current operator
        else{
            historyBar.textContent = historyBar.textContent.slice(0, historyBar.textContent.length - 1) + char;
        }
        
        // Get out of the function to handle next iteration
        return;
    }

    // If the user has got the results, then clear the input fields
    if(gotResult){
        gotResult = false;

        historyBar.textContent = "";
        resultBar.textContent = "";
    }

    // Add the current character to resultBar
    resultBar.textContent += char;

    // If the current character is an operator (+-*/)
    if(operators.slice(0, operators.length).includes(char)){
        // If the first character of the resultBar is NOT an operator and the previous
        // character is not (.), then only break the monotony
        if(!(operators.includes(resultBar.textContent[0])) && (resultBar.textContent[resultBar.textContent.indexOf(char) - 1] !== ".")){
            monotonyBreak = true;
        }
        
        // Set the historyBar's value to resultBar's value if the previous character is not
        // (.)
        if(resultBar.textContent[resultBar.textContent.indexOf(char) - 1] !== "."){
            historyBar.textContent += resultBar.textContent;
        }

        // Remove the operator from the resultBar
        resultBar.textContent = resultBar.textContent.slice(0, resultBar.textContent.length - 1);
    }

    // If the first character of the historyBar is an operator (+-*/), then set the value of 
    // historyBar to empty and that of resultBar to 0
    if(operators.slice(0, operators.length).includes(historyBar.textContent[0])){
        historyBar.textContent = "";
        resultBar.textContent = "0";
    }
    
    // If the first character of the resultBar is an operator (+-*/), then set the value of
    // the resultBar to 0
    if(operators.slice(0, operators.length).includes(resultBar.textContent[0])){
        resultBar.textContent = "0";
    }

    // If the length of the value of resultBar is more than 11, decrease the font size
    if(resultBar.textContent.length > 11){
        resultBar.style.fontSize = "3rem";
    }

    // Do not let the user enter more than 16 characters
    if(resultBar.textContent.length > 15){
        resultBar.textContent = resultBar.textContent.substring(0, 16);
    }
}));

// Add an event listener to the history button
/*  
    1. Slide the history sheet to the top
    2. Fetch the expressions from localStorage
    3. Populate the history sheet
*/
historyBtn.addEventListener('click', () => {
    // If historySheet is up, then send it to the bottom
    if(historySheet.getAttribute("data-active") === "yes"){
        historySheet.setAttribute("data-active", "no");

        historySheet.textContent = "";

        // Smooth the movement
        historySheet.style.transitionDuration = "0.5s";
        
        // Move the sheet down
        historySheet.style.bottom = "-70%";

        // Get out of the function as we don't want any weird behavior
        return;
    }

    historySheet.setAttribute("data-active", "yes");

    // Smooth the movement
    historySheet.style.transitionDuration = "0.5s";

    // Move the sheet up
    historySheet.style.bottom = "70%";

    const history = JSON.parse(localStorage.getItem(historyKeyName));

    if(!history || history == []){
        historySheet.innerHTML = `<h2>No History!</h2>`;
    }
    else{
        history.forEach(expr => {
            const lhs = expr.slice(0, expr.indexOf("="));
            const rhs = expr.slice(expr.indexOf("=") + 1);

            historySheet.innerHTML += 
            `
            <div class = "toast">
                <p>${lhs} = </p>
                <p><strong>${rhs}</strong></p>
            </div>
            `;
        });
    }
});