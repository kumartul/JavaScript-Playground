// API URL
const api_url = "https://api.github.com/users/";

// Container in which user's details will be displayed
const userContainer = document.querySelector('.container .user');

const searchBar = document.getElementById('search');

// Function: Populates the userContainer
const populateContainer = data => {

    // If 'data' object has a property named 'message', i.e. the user doesn't exists,
    // then, change the message to "User Not Found!"
    if(data.hasOwnProperty("message")){
        userContainer.querySelector('h2').textContent = "User Not Found!";

        // Get out of the function else every field will display undefined
        return;
    }
    
    // Store the name of user's company
    let company = data.company;

    // If the user is not associated with any company, then set the value to 'None'
    if(!company){
        company = "None";
    }

    userContainer.innerHTML = 
    `
    <img src = "${data.avatar_url}" alt = "${data.login}'s Profile Pic">
    <p><strong>Username: </strong> ${data.login}</p>
    <p><strong>Name: </strong> ${data.name}</p>
    <p><strong>Followers:</strong> ${data.followers} &nbsp;&nbsp;&nbsp; <strong>Following:</strong> ${data.following}</p>
    <p><strong>Repositories:</strong> ${data.public_repos}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Company: </strong>${company}</p>
    <p><a href = "${data.html_url}" target = "_blank">View it</a> on GitHub</p>
    `;
}

// Asynchronous Function: Fetches the user details and converts the response to JSON and
// then calls the populateContainer() function
const fetchUser = async user => {
    let response = await fetch(api_url + user);
    let responseData = await response.json();

    populateContainer(responseData);    
}

// Add an event listener to the searchBar
/*
    1. If a user presses the enter key, the value in the search bar will be stored in a 
    variable
    2. fetchUser() function will be called
*/
searchBar.addEventListener('keydown', event => {
    if(event.key === "Enter"){
        const username = searchBar.value;

        fetchUser(username);
    }
});
