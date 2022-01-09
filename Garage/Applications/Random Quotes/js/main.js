// API URL
const api_url = "https://api.quotable.io/random";

// Quote Container
const quoteContainer = document.querySelector('.quote').querySelector('.text');

// Author Container
const authorContainer = document.querySelector('.quote').querySelector('.author');

// Next Button
const nextBtn = document.querySelector('.next');

// Function: Populates the container with the data (quote and author name)
const populateContainer = data => {
    quoteContainer.innerHTML = `<p><h1><i class = "fa fa-quote-left"></i></h1>${data.content}</p>`;
    
    authorContainer.innerHTML = `- ${data.author}`;
}

// Asynchronous Function: Fetches the quote from the API
const fetchQuote = async () => {
    const response = await fetch(api_url);
    const responseData = await response.json();

    populateContainer(responseData);
}

// Add a click event listener to the next button so that new quote appears 
nextBtn.addEventListener('click', fetchQuote);

// Run the function as soon as the page loads
fetchQuote();