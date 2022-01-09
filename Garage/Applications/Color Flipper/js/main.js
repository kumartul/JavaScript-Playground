const changeColorBtn = document.querySelector('button');

// Function: Generates a random rgba() color
const generateRandomRGBAColor = () => {
    const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random()})`;
    return randomColor;
}

// Function: Changes the background color of the body
const changeBackgroundColor = color => {
    document.body.style.backgroundColor = color;
}

// Add a click event listener to the body so that whenever a user clicks on the button,
// the background color of the body changes to some other color
changeColorBtn.addEventListener('click', () => {
    changeBackgroundColor(generateRandomRGBAColor());
});