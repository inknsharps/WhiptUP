// Query selectors for the HTML Elements
let recipesContainer = document.querySelector(".recipe-cards");
let submitButton = document.querySelector("#submit-button");
let selectedDiet = document.querySelector("#diet");
let selectedIngredients = document.querySelector("input");
var foodScrapTableEl = document.querySelector('#foodScrapTable');
var foodScrapHeaderEl = document.querySelector('#tableHeader')
var ntaNameEl = document.querySelector('#ntaName')

// Declare variable for recipe information
let recipeList = {};

// Make APIs Calls functionality
// Async function that calls the Edamam API with ingredients, these can be separated by commas
// Consider adding healthLabels as a parameter to the function.
async function callRecipes(ingredients, diet){
    // EdamamID and Key 
    const edamamID = "160f3329";
    const edamamKey = "ac5580afc95ecea7517a637138b4d2e1";
    let recipeAPI = `https://api.edamam.com/search?q=${ingredients}&to=50&app_id=${edamamID}&app_key=${edamamKey}`
    if (diet) {
        recipeAPI += `&health=${diet}`
    }
    let fetchedRecipes = await fetch(recipeAPI);
    recipeList = await fetchedRecipes.json();
    console.dir(recipeList);
}

// Async function that calls the list of Food Scrap Dropoff locations by neightborhood name, that are open year round
// We should probably provide the ntaNames that are acceptable in this dataset
// async function callFoodScrapDirectory(ntaName){
//     let foodScrapList = `https://data.cityofnewyork.us/resource/if26-z6xq.json?ntaname=${ntaName}&open_months=Year%20Round`
//     let foodScrapJSON = await fetch(foodScrapList);
//     let foodScrapDirectory = await foodScrapJSON.json();
//     console.dir(foodScrapDirectory);
// };
function callFoodScrapDirectory(ntaName){
    fetch('https://data.cityofnewyork.us/resource/if26-z6xq.json?ntaname=' + ntaName + '&open_months=Year%20Round')
    .then(function(response){return response.json()})
    .then(function(data){
        console.log(data)
        foodScrapTableEl.textContent=''
        foodScrapHeaderEl.textContent=''
        printFoodScrapLocations(data);
    })
    .catch(function(){})
}


// Function to build out the recipe cards when the submit form button is pressed
function buildRecipeCard(){
    let randomRecipe = Math.floor(Math.random()*recipeList.hits.length);

    let cardContainer = document.createElement("div");
    cardContainer.className = "card cell small-4";
    cardContainer.setAttribute("style", "width: 300px");

    let cardHeader = document.createElement("div");
    cardHeader.className = "card-divider" ;
    cardHeader.innerText = recipeList.hits[randomRecipe].recipe.label;

    let cardImage = document.createElement("img");
    cardImage.src = recipeList.hits[randomRecipe].recipe.image;

    let cardSection = document.createElement("div");
    cardSection.className = "card-section";
    cardSection.innerHTML = `
        <p>${recipeList.hits[randomRecipe].recipe.dishType}</p>
        <a href='${recipeList.hits[randomRecipe].recipe.url}'>Link to Recipe</a>
        <button type="button" class="button primary save-recipe">Save Recipe</button>`;

    cardContainer.appendChild(cardHeader);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardSection);

    recipesContainer.appendChild(cardContainer);
    let saveRecipeButton = document.querySelectorAll(".save-recipe");
    for (let i = 0; i < saveRecipeButton.length; i++){
        saveRecipeButton[i].addEventListener("click", saveRecipeLink);
    }
}

// Async function to build the recipes section
async function buildRecipeSection(){
    await callRecipes(selectedIngredients.value, selectedDiet.value);
    for (let i = 0; i < 6; i++){
        buildRecipeCard();
    }
}

// Function to save the clicked recipe as a key-value pair of recipe name and link
function saveRecipeLink(){
    // Set the card itself to a variable
    let recipeName = this.parentElement.previousSibling.previousSibling.innerText;
    console.log(recipeName);
    let recipeLink = this.parentElement.firstElementChild.nextElementSibling.href;
    console.log(recipeLink);

    localStorage.setItem(recipeName, recipeLink);
}

// Function to load a saved recipe
function loadRecipesList(){
    let savedRecipesContainer = document.createElement("div");
    let savedRecipesHeader = document.createElement("h1");
    savedRecipesHeader.textContent = "Saved Recipes";
    savedRecipesContainer.appendChild(savedRecipesHeader);

    let savedRecipesList = document.createElement("ul");

    for (let i = 0; i < localStorage.length; i++){
        let savedRecipeName = localStorage.key(i);
        let savedRecipeLink = localStorage.getItem(localStorage.key(i));
        console.log(savedRecipeName);
        console.log(savedRecipeLink);

        let savedRecipeListItem = document.createElement("li");
        let savedRecipeInfo = `${savedRecipeName}: <a href=${savedRecipeLink}>Link to Recipe</a>`
        savedRecipeListItem.innerHTML = savedRecipeInfo;
        
        savedRecipesList.appendChild(savedRecipeListItem);
    }
    
    savedRecipesContainer.appendChild(savedRecipesList);
    recipesContainer.appendChild(savedRecipesContainer);
}

// Function to build out the saved recipes section
    // Pull data from localStorage, and use that for constructing the recipe cards
    // Then rebuild the recipe section

// Function to generate and build out a list of places to drop off food scraps
function printFoodScrapLocations(resultObj) {

    var headerName = document.createElement('th')
    headerName.setAttribute("width", "500")
    headerName.textContent="Name"

    var headerDays = document.createElement('th')
    headerDays.setAttribute("width", "200")
    headerDays.textContent="Days Open"

    var headerOpen = document.createElement('th')
    headerOpen.setAttribute("width", "200")
    headerOpen.textContent="Opening Hours"

    var headerClose = document.createElement('th')
    headerClose.setAttribute("width", "200")
    headerClose.textContent="Closing Hours"

    var headerAddress = document.createElement('th')
    headerAddress.setAttribute("width", "600")
    headerAddress.textContent="Address"

    var headerWebsite = document.createElement('th')
    headerWebsite.setAttribute("width", "600")
    headerWebsite.textContent="Website"

    foodScrapHeaderEl.append(headerName, headerDays, headerOpen, headerClose, headerAddress, headerWebsite)

    
    for (var i=0; i < resultObj.length; i++) {
        var resultRow = document.createElement('tr');
        resultRow.classList.add('customRow1')
        foodScrapTableEl.append(resultRow)

        var nameCol = document.createElement('td');
        nameCol.textContent=resultObj[i].food_scrap_drop_off_site;
        resultRow.appendChild(nameCol)

        var daysCol = document.createElement('td');
        daysCol.textContent=resultObj[i].operation_day;
        resultRow.appendChild(daysCol)

        var openCol = document.createElement('td');
        openCol.textContent=resultObj[i].hours_to;
        resultRow.appendChild(openCol)

        var closeCol = document.createElement('td');
        closeCol.textContent=resultObj[i].hours_from;
        resultRow.appendChild(closeCol);

        var addressCol = document.createElement('td')
        addressCol.textContent=resultObj[i].location;
        resultRow.appendChild(addressCol);

        var webCol = document.createElement('td');
        var webLink = document.createElement('a')
        webCol.append(webLink)
        webLink.textContent=resultObj[i].website
        webLink.setAttribute('href', resultObj[i].website)
        resultRow.appendChild(webCol)
    }
}

ntaNameEl.addEventListener('change', function(event){
    event.preventDefault();
    var neighborhood = event.target.value
    console.log(neighborhood)
    callFoodScrapDirectory(neighborhood)
})

// Event listener for retrieving saved recipes
// Event Listener for the submit form button
submitButton.addEventListener("click", buildRecipeSection);