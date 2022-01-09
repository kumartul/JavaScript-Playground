const generatePasswordBtn = document.getElementById('generate-password');

// Grab all the checkboxes as an array
const params = Array.from(document.querySelectorAll('input[type="checkbox"]'));

// Input Field
const passwordLengthField = document.getElementById('password-length');

// Password will be printed here
const passwordContainer = document.querySelector('.password').querySelector('p');

// Sets
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = lowercaseLetters.toUpperCase();
const numbers = "1234567890";
const specialCharacters = "~!@#$%^&*()_+|=-`\\{}[]:;'\"/?.,<>";

// Function: Returns a random character from the set
const pickRandom = set => {
    return set[Math.floor(Math.random() * set.length)];
}

// Function: Generates a random password using a simple algorithm
const generatePassword = (includeNums, includeSpecialChars, includeUppercaseLetters, includeLowercaseLetters, passwordLength, parameters) => {
    let password = "";

    // First add all the characters from the sets requested
    if(includeNums) password += pickRandom(numbers);
    if(includeSpecialChars) password += pickRandom(specialCharacters);
    if(includeUppercaseLetters) password += pickRandom(uppercaseLetters);
    if(includeLowercaseLetters) password += pickRandom(lowercaseLetters);

    // Add a random character from a random set until the desired length is achieved
    while(passwordLength > password.length){
        password += pickRandom(pickRandom(parameters));
    }

    return password;
}

// Function: Displays the password
const displayPassword = password => {
    passwordContainer.textContent = password;
}

// Add a click event listener to the generatePasswordBtn
/*
    1. Declare some conditional variables
    2. Declare an array named 'parameters'. This will store the sets requested
    3. Initialize all the variables
    4. Display the password based on certain conditions
*/
generatePasswordBtn.addEventListener('click', () => {
    // Conditional Variables
    let hasNums;
    let hasSpecialChars;
    let hasUppercaseChars;
    let hasLowercaseChars;

    // This will store the requested
    const parameters = [];

    let paramCount = 0;

    // Iterate through each parameter and check if it is checked or not
    // If it is checked, then add the set to the parameters array and set the conditional 
    // variable to true
    // Increment the paramCount by 1
    params.forEach(param => {
        if(param.checked){
            if(param.id === "uppercase-letters"){
                parameters.push(uppercaseLetters);
                
                hasUppercaseChars = true;
            } 
            if(param.id === "lowercase-letters"){
                parameters.push(lowercaseLetters);
                
                hasLowercaseChars = true;
            } 
            if(param.id === "special-characters"){
                parameters.push(specialCharacters);
                
                hasSpecialChars = true;
            } 
            if(param.id === "numbers"){
                parameters.push(numbers);

                hasNums = true;
            } 

            paramCount++;
        }
    });
    
    const passwordLength = Number(passwordLengthField.value);

    if(passwordLength >= paramCount && paramCount > 0 && passwordLength < 81){
        displayPassword(generatePassword(hasNums, hasSpecialChars, hasUppercaseChars, hasLowercaseChars, passwordLength, parameters));
    }
});