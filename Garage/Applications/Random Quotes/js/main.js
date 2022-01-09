// API URL
const api_url = "https://api.quotable.io/random";

// Key name to access quotes from localStorage
const quotesKeyName = "quotes";

// Main Container
const container = document.querySelector('.container');

// Quote Container
const quoteContainer = document.querySelector('.quote').querySelector('.text');

// Author Container
const authorContainer = document.querySelector('.quote').querySelector('.author');

// Next Button
const nextBtn = document.querySelector('.next');

// Favorites Button
const favBtn = document.querySelector('.fav');

// Global Quote
// This will be used to handle localStorage operations
let quote = {}

// Function: Adds the quote to favorites list
const addToFavorites = quote => {
    // Fetch the quotes from localStorage as an array
    let quotesArr = JSON.parse(localStorage.getItem(quotesKeyName));

    // If quotesArr doesn't exists, initialize it with an empty array
    if(!quotesArr) quotesArr = [];

    // Add the quote to the array
    quotesArr.push({ quote: quote.quote, author: quote.author });

    localStorage.setItem(quotesKeyName, JSON.stringify(quotesArr));
}

// Function: Remove the quote from favorites list
const removeFromFavorites = quote => {
    // Fetch the quotes from localStorage as an array
    let quotesArr = JSON.parse(localStorage.getItem(quotesKeyName));
    
    // Remove the quote from the array
    quotesArr.splice(quotesArr.indexOf(quote), 1);

    localStorage.setItem(quotesKeyName, JSON.stringify(quotesArr));
}

// Function: Populates the container with the data (quote and author name)
const populateContainer = data => {
    // Variable that will determine if the quote is in favorites or not
    let inFav = "no";

    quoteContainer.innerHTML = `<p><h1><i class = "fa fa-quote-left"></i></h1>${data.content}</p>`;
    
    // Fetch the quotes from localStorage as an array
    let quotesArr = JSON.parse(localStorage.getItem(quotesKeyName));

    // If quotesArr doesn't exists, initialize it with an empty array
    if(!quotesArr) quotesArr = [];

    if(quotesArr.includes(quote)){
        inFav = "yes";    
    }
    
    authorContainer.innerHTML = 
    `<p>- ${data.author}</p>
    <i class = "fa fa-heart heart" data-fav="${inFav}"><i>`;

    // Grab the heartIcon
    const heartIcon = document.querySelector('.heart');

    // If the quote is in favorites list, then paint the heart with red color
    if(quotesArr.includes(quote)){
        heartIcon.style.color = "red";
    }

    // Add an event listener to the heartIcon
    heartIcon.addEventListener('click', event => {
        // If the quote is not in favorites list, then add it to the favorites list and 
        // change the color to red
        if(event.target.getAttribute("data-fav") === "no"){
            addToFavorites(quote);

            event.target.style.color = "red";

            event.target.setAttribute("data-fav", "yes");
        }
        else{
            removeFromFavorites(quote);

            event.target.style.color = "lightgrey";

            event.target.setAttribute("data-fav", "no");
        }
    });
}

// Asynchronous Function: Fetches the quote from the API
const fetchQuote = async () => {
    const response = await fetch(api_url);
    const responseData = await response.json();

    // Initialize the quote so that it can be used in future operations
    quote = {
        quote: responseData.content,
        author: responseData.author
    }

    populateContainer(responseData);
}

// Add a click event listener to the next button so that new quote appears 
nextBtn.addEventListener('click', fetchQuote);

favBtn.addEventListener('click', () => {
    container.innerHTML = ``;

    // Fetch all the quotes from localStorage
    let quotesArr = JSON.parse(localStorage.getItem(quotesKeyName));

    // If the quotesArr doesn't exists or is empty, then display a 'No Favorite Quote' 
    // message
    if(!quotesArr || quotesArr == []){
        container.innerHTML = 
        `<h2> No Favorite Quote </h2>`;
    }
    else{
        quotesArr.forEach(quote => {
            container.innerHTML += 
            `
            <div class = "toast">
                <p>${quote.quote}</p>
                <p><strong>- ${quote.author}</strong></p>
            </div>
            `;
        });
    }
});

// Run the function as soon as the page loads
fetchQuote();