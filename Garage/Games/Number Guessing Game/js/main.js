// Enclose the code in a block so that randomNum can't be accessed from console
{
    // States
    const states = ["win", "high", "low", "out_of_moves"];
    
    // Input Field
    const guessNumField = document.getElementById('guess-number');
    
    const submitBtn = document.getElementById('submit-btn');

    const problemBar = document.querySelector('.problem');

    const previousGuessBar = document.querySelector('.previous-guesses-bar');

    const correctStatusBox = document.querySelector('.correct');
    const incorrectStatusBox = document.querySelector('.incorrect');
    const outOfMovesStatusBox = document.querySelector('.out-of-moves');

    // Status Boxes
    const statusBoxes = [correctStatusBox, incorrectStatusBox, outOfMovesStatusBox];
    
    // Function: Generates a random number between 0 and 100 and returns it
    const generateRandomNum = () => {
        const randomNum = Math.floor(Math.random() * 98) + 1;
        return randomNum;
    }
    
    // Initialize the random number
    const randomNum = generateRandomNum();

    // Function: Hides the box
    const hideBox = box => {
        box.style.display = "none";
    }

    // Function: Shows the box
    const showBox = box => {
        box.style.display = "block";
    }

    // Function: Displays the message
    const displayMessage = message => {
        problemBar.textContent = message;
    }

    // Function: Disables input field and submit button and changes the cursor to 
    // 'not-allowed' on hover
    const disableInputAndButton = () => {
        guessNumField.disabled = true;
        submitBtn.disabled = true;

        guessNumField.style.cursor = "not-allowed";
        submitBtn.style.cursor = "not-allowed";
    }
    
    // Function: Displays the result based on situation
    const displayResult = state => {
        // First, hide all the status boxes to prevent cluttering
        statusBoxes.forEach(statusBox => hideBox(statusBox));

        if(state === states[0]){
            showBox(correctStatusBox);

            displayMessage("Congratulations! You guessed it right...");

            disableInputAndButton();
        }
        else if(state === states[1]){
            showBox(incorrectStatusBox);

            displayMessage("Last guess was too high!");
        }
        else if(state === states[2]){
            showBox(incorrectStatusBox);

            displayMessage("Last guess was too low!");
        }
        else if(state === states[3]){
            showBox(outOfMovesStatusBox);

            displayMessage("Out Of Moves!");
        }
    }
    
    // Function: Evaluates the response
    const evaluateResponse = (randomNum, num) => {
        let state;

        if(randomNum > num){
            state = states[2];
        }
        else if(randomNum < num){
            state = states[1];
        }
        else if(randomNum === num){
            state = states[0];
        }

        displayResult(state);
    }

    // Function: Adds the last guess to the previous guesses bar
    const addToPreviousGuess = num => {
        previousGuessBar.innerHTML += `<span class = "num">${num}</span>`;
    }
    
    // Function: Clears the input and focusses on it
    const clearInputAndFocus = () => {
        guessNumField.value = "";
        guessNumField.focus();
    }

    // Number of guesses
    let numOfGuesses = 0;
    
    // Add a click event listener to the button
    /*
        1. Grab the input number
        2. If the player has moves left:
            Add the last guess to previous guesses bar
            Evaluate the response
            Clear the input and focus on it
            Increment the number of guesses by 1
        3. If the player runs out of moves:
            Display the 'out of moves' message
            Disable the input and submit button
    */
    submitBtn.addEventListener('click', () => {
        let inputNum = Number(guessNumField.value);

        // If input number is out of range, simply get out of the function
        if(inputNum > 99 || inputNum < 1) return;

        if(numOfGuesses < 10){
            addToPreviousGuess(inputNum);
    
            evaluateResponse(randomNum, inputNum);

            clearInputAndFocus();

            numOfGuesses++;
        }
        else{
            displayResult(states[3]);
            
            disableInputAndButton();
        }
    });
}