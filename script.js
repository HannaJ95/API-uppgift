//---- URL ----//
const base_url = 'https://www.thecocktaildb.com/api/json/v1/1';

//---- DOM ----//
const alcohol_select = document.getElementById('alcohol_select');
const search_button = document.getElementById('search_button');
const recipe_container = document.getElementById('recipe-container');


//---- FUNCTIONS ----//
function get_ingredients_array(drink) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        
        if (ingredient) {
            ingredients.push({
                name: ingredient,
                measure: measure || ''
            });
        }
    }
    
    const ingredients_list = ingredients
        .map(ing => `<li>${ing.measure} ${ing.name}</li>`)
        .join('');

    return ingredients_list;
}

async function fetch_drinks_by_alcohol(alcohol) {
    const url = `${base_url}/filter.php?i=${alcohol}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks;          
}

async function fetch_drink_details(drinkId) {
    const url = `${base_url}/lookup.php?i=${drinkId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks[0];
}


//---- EVENT LISTENER ----//
search_button.addEventListener('click', async () => {
    
    try {
        //1. Get chosen alcohol
        const alcohol_type = alcohol_select.value;
        
        if (!alcohol_type) {
            alert('Välj en alkohol först!');
            return;
        }
        
        console.log('Vald alkohol:', alcohol_type);
        
        //2. Get drinkS with chosen alcohol
        const drinks = await fetch_drinks_by_alcohol(alcohol_type);
        console.log("1. drinkar med vald alkohol:", drinks);

        //3. Get ramdomize drink id
        const random_index = Math.floor(Math.random() * drinks.length);
        const drink_id = drinks[random_index].idDrink;
        
        console.log(`2. random_index: ${random_index}, drink id: ${drink_id}`);

        //4. Get drink-info from id
        const drink = await fetch_drink_details(drink_id);
        
        console.log("3. Drink details:", drink.strDrink);
        console.log(drink);

        //5. Get list with ingredients wrapped in html <li> tags
        const ingredients_list = get_ingredients_array(drink);
        
        console.log("Ingredienslista:", ingredients_list);

        //6. Display on website
        recipe_container.innerHTML = `
            <h2>${drink.strDrink}</h2>

            <h3 class="recipe__ingredients">Ingredients</h3>
            <ul class="recipe__ingredients-list">
                ${ingredients_list}
            </ul>

            <h3 class="recipe__instructions">Instructions</h3>
            <p class="recipe__instructions-text">${drink.strInstructions}</p>
        `;

    } catch (e) {
        console.error('FEL:', e);
        alert('Något gick fel!');
    }
});