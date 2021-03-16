// Query selectors for the HTML Elements
let recipesContainer = document.querySelector(".recipes-container");
let submitButton = document.querySelector("#submit-button");
let selectedDiet = document.querySelector("#diet");
let selectedIngredients = document.querySelector("input");

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
async function callFoodScrapDirectory(ntaName){
    let foodScrapList = `https://data.cityofnewyork.us/resource/if26-z6xq.json?ntaname=${ntaName}&open_months=Year%20Round`
    let foodScrapJSON = await fetch(foodScrapList);
    let foodScrapDirectory = await foodScrapJSON.json();
    console.dir(foodScrapDirectory);
};

// Async function that calls the list of DonateNYC locations, that accepts Food/Beverage, by neighborhood name
// We should probably provide the ntaNames that are acceptable in this dataset
async function callDonateNYCDirectory(ntaName){
    let donateNYCList = `https://data.cityofnewyork.us/resource/gkgs-za6m.json?ntaname=${ntaName}&categoriesaccepted=Food/Beverage`
    let donateNYCJSON = await fetch(donateNYCList);
    let donateNYCDirectory = await donateNYCJSON.json();
    console.dir(donateNYCDirectory);
};

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
    let saveRecipeButton = document.querySelector(".save-recipe");
    saveRecipeButton.addEventListener("click", saveRecipeCard);
}

// Async function to build the recipes section
async function buildRecipeSection(){
    await callRecipes(selectedIngredients.value, selectedDiet.value);
    for (let i = 0; i < 6; i++){
        buildRecipeCard();
    }
}

// Function to save the currently selected recipe to localStorage as an stringified HTML
function saveRecipeCard(){
    // Set the card itself to a variable
    let recipeCard = this.parentElement.parentElement;
    console.log(recipeCard.outerHTML);
    localStorage.setItem("savedRecipe", JSON.stringify(recipeCard.outerHTML));
}

// Function to load a saved recipe
async function loadRecipeCard(){
    let savedRecipe = await JSON.parse(localStorage.getItem("savedRecipe"));
    console.log(savedRecipe);
    recipesContainer.innerHTML = savedRecipe;
}

// Function to build out the saved recipes section
    // Pull data from localStorage, and use that for constructing the recipe cards
    // Then rebuild the recipe section

// Function to generate and build out a list of places to drop off food scraps
    // Needs to grab the data from callFoodScrapDirectory, based on the neighborhood selected
    // Then construct HTML elements using the data from OpenDataNYC APIs, useful ones that they provide are:
        // .food_scrap_drop_off_site (the name of the site)
        // .operation_day (which day it's open)
        // .hours_from (hour opening)
        // .hours_to (hour closing)
        // .location (address of the site)
        // .website (the site of the program that is handling this drop off)

// Function to generate and build out a list of places to drop off food donations
    // Needs to grab the data from callDonateNYCDirectory, based on the neighborhood selected
    // Then construct HTML elements using the data from OpenDataNYC APIs, useful ones that they provide are:
        // .site (the name of the site)
        // .address (the address of the site)
        // .hours (operation hours)
        // .website (the site of the program that is handling this donation)
        // .additionalmaterialinformation (more detailed info about food donation and distribution)

// Event listener for retrieving saved recipes
// Event Listener for the submit form button
submitButton.addEventListener("click", buildRecipeSection);