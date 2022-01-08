// API URL
const api_url = "https://api.github.com/users/";

// Container in which user's details will be displayed
const userContainer = document.querySelector('.container .user');

const searchBar = document.getElementById('search');

// Button that will navigate the user to the favoritesList
const favoriteHeartBtn = document.querySelector('.heart');

// Name of the key to store favorites list in the localStorage
const favoritesListKeyName = "favorites";

// This will be used as a global variable
// If a user clicks on the favorite button, then the user will be added in the favorites
// list
let username;

// Function: Changes the color of the heart icon
const changeHeartColor = (state, icon) => {
    if(state === "in"){
        icon.style.color = "lightgrey";
    }
    else{
        icon.style.color = "orangered";
    }
}

// Function: Removes the user from favorite list
const removeFromFavorites = username => {
    // Fetch the favorites list as an array
    let favoritesArr = JSON.parse(localStorage.getItem(favoritesListKeyName));

    // Remove the user from the array
    favoritesArr.splice(favoritesArr.indexOf(username), 1);

    localStorage.setItem(favoritesListKeyName, JSON.stringify(favoritesArr));
}

// Function: Adds the user to favorite list
const addToFavorites = username => {
    // Fetch the favorites list as an array
    let favoritesArr = JSON.parse(localStorage.getItem(favoritesListKeyName));

    // If favoritesArr doesn't exists, then initialize an empty array
    if(!favoritesArr) favoritesArr = [];

    // Add the user to the array
    favoritesArr.push(username);

    localStorage.setItem(favoritesListKeyName, JSON.stringify(favoritesArr));
}

// Function: Checks if the user exists in favoritesList
const userInFavList = username => {
    let favoritesArr = JSON.parse(localStorage.getItem(favoritesListKeyName));

    // If favoritesArr doesn't exists, then initialize an empty array
    if(!favoritesArr) favoritesArr = [];

    return favoritesArr.includes(username) ? true : false;
}

// Function: Populates the userContainer
const populateContainer = data => {
    // Initialize 'username' global variable to handle further operations
    username = data.login;

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

    // Remove all margins so that the content doesn't overflows
    userContainer.style.margin = "0";

    userContainer.innerHTML = 
    `
    <i class = "fa fa-heart" data-state="out"></i>
    <img src = "${data.avatar_url}" alt = "${data.login}'s Profile Pic">
    <p><strong>Username: </strong> ${data.login}</p>
    <p><strong>Name: </strong> ${data.name}</p>
    <p><strong>Followers:</strong> ${data.followers} &nbsp;&nbsp;&nbsp; <strong>Following:</strong> ${data.following}</p>
    <p><strong>Repositories:</strong> ${data.public_repos}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Company: </strong>${company}</p>
    <p><a href = "${data.html_url}" target = "_blank">View it</a> on GitHub</p>
    `;

    // Grab the reference to the heart icon
    const heartIcon = userContainer.querySelector('.fa-heart');

    // If the user is in favoritesList, then set the state to 'in' and change the color of
    // icon to 'orangered'
    if(userInFavList(username)){
        heartIcon.setAttribute("data-state", "in");

        heartIcon.style.color = "orangered";
    }

    // Add a click event listener to the heart icon
    /*
        1. If the user is not in favorites, then add it to favorites and change the color to 
            orangered
        2. If the user is in favorites, then remove it from favorites and change the color to
            lightgrey
    */
    heartIcon.addEventListener('click', () => {
        // Heart's state (in/out)
        let heartState = heartIcon.getAttribute("data-state");

        changeHeartColor(heartState, heartIcon)


        if(heartState === "in"){
            removeFromFavorites(username);

            heartIcon.setAttribute("data-state", "out");
        }
        else{
            addToFavorites(username);
            
            heartIcon.setAttribute("data-state", "in");
        }
    });
}

// Asynchronous Function: Fetches the user details and converts the response to JSON and
// then calls the populateContainer() function
const fetchUser = async user => {
    let response = await fetch(api_url + user);
    let responseData = await response.json();

    populateContainer(responseData);
}

// Function: Fetches all the users from the favoritesList
const fetchFavUsers = () => {
    const favUsers = JSON.parse(localStorage.getItem(favoritesListKeyName));

    return favUsers;
}

// Function: Displays the favorite users
const displayFavUsers = (favUsers, container) => {
    favUsers.forEach(async favUser => {
        const response = await fetch(api_url + favUser);
        const responseData = await response.json();

        document.querySelector('.child-container').innerHTML += 
        `<div class = "toast">
            <div class = "image">
                <img src = "${responseData.avatar_url}" alt = "${responseData.login}'s profile pic">
            </div>
            <div class = "info">
                <p><strong>${responseData.login}</strong> (${responseData.name})</p>
                <p><strong>Followers: </strong> ${responseData.followers} <strong>Following: </strong> ${responseData.following}</p>
            </div>
        </div>`;
    });
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

// Add a click event listener to the heart button that will navigate the user to 
// favoritesList
favoriteHeartBtn.addEventListener('click', () => {
    // Clear the container so that new content can be shown
    document.querySelector('.child-container').innerHTML = ``;

    displayFavUsers(fetchFavUsers(), userContainer);
});