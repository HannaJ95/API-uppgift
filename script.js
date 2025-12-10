//---- URL ----//
const base_url = 'https://www.thecocktaildb.com/api/json/v1/1';

//---- DOM ----//
const alcohol_select = document.getElementById('alcohol_select');
const search_button = document.getElementById('search_button');
const recipe_container = document.getElementById('recipe-container');


//---- FUNCTIONS ----//
function get_ingredients_and_measure(drink) {
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
    return ingredients;
}

function convert_to_cl(measure) {
    if (!measure) return '';
    
    measure = measure.trim().toLowerCase();
    
    const amount = parseFloat(measure);
    
    if (isNaN(amount)) return measure;
    
    if (measure.includes('ml')) {
        return `${(amount / 10).toFixed(1)} cl`;
    }
    else if (measure.includes('oz')) {
        return `${Math.round(amount * 3)} cl`;
    } 
    else if (measure.includes('cl')) {
        return `${amount} cl`;
    }
    else if (measure.includes('cup')) {
        return `${Math.round(amount * 24)} cl`;
    }
    else if (measure.includes('shot')) {
        return `${amount * 4} cl`;
    }
    else {
        return measure;
    }
}

function build_ingredients_html(ingredients) {
    const ingredients_list = ingredients
        .map(ing => `<li>${ing.measure} ${ing.name}</li>`)
        .join('');

    return ingredients_list;
}

function build_ingredients_cl_html(ingredients) {
    const ingredients_list = ingredients
        .map(ing => {
            const converted_measure = convert_to_cl(ing.measure);
            return `<li>${converted_measure} ${ing.name}</li>`;
        })
        .join('');

    return ingredients_list;
}

//---- ASYNC FUNCTIONS ----//
async function fetch_drinks_by_alcohol(alcohol) {
    const url = `${base_url}/filter.php?i=${alcohol}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).drinks;
}

async function fetch_drink_details(drinkId) {
    const url = `${base_url}/lookup.php?i=${drinkId}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).drinks[0];
}


//---- EVENT LISTENER ----//
search_button.addEventListener('click', async () => {
    
    try {
        //1. Get chosen alcohol
        const alcohol = alcohol_select.value;

        if (!alcohol) {
            alert('Please pick alkohol');
            return;
        }
        
        //2. Get drinkS with chosen alcohol
        const drinks = await fetch_drinks_by_alcohol(alcohol);

        if (!drinks || drinks.length === 0) {
            alert('No drinks found with this alcohol!');
            return;
        }

        //3. Get ramdomize drink id
        const random_index = Math.floor(Math.random() * drinks.length);
        const drink_id = drinks[random_index].idDrink;

        //4. Get drink-info from id
        const drink = await fetch_drink_details(drink_id);

        //5. Get list with ingredients wrapped in html <li> tags
        const ingredients_and_measure = get_ingredients_and_measure(drink);
        // const ingredients_html_list = build_ingredients_html(ingredients_and_measure);
        const ingredients_html_list = build_ingredients_cl_html(ingredients_and_measure);
        
        console.log("Ingredienslista:", ingredients_and_measure);

        //6. Display on website
        recipe_container.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <h3 class="recipe__ingredients">Ingredients:</h3>
                <ul class="recipe__ingredients-list">
                    ${ingredients_html_list}
                </ul>
                <h3 class="recipe__instructions">Instructions:</h3>
                <p class="recipe__instructions-text">${drink.strInstructions}</p>
        `;

    } catch (e) {
        console.error('FEL:', e);
        alert('Something went wrong! Please try again.');
    }
});