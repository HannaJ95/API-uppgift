
//---- URL ----//
const base_url = 'https://www.thecocktaildb.com/api/json/v1/1';

//---- DOM ----//
const alcohol_select = document.getElementById('alcohol_select');
const search_button = document.getElementById('search_button');
const recipe_container = document.getElementById('recipe-container');


//---- FUNKTIONER ----//
function insertText(element_id, text){

    const element = document.getElementById(element_id);

    if (element.textContent === '') {
        element.textContent = text;
    } else {
        element.textContent = text;
    }
}

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



search_button.addEventListener('click', () => {
    
    
    const get_drink = async () => {
        
        try {
            
            //1. Tar fram drinkar som innehåller vald alkohol


                const alcohol_type = alcohol_select.value;
                const filter_url_part = '/filter.php?i=';
                const filter_url = base_url + filter_url_part + alcohol_type;
                
                const drinks_response = await fetch(filter_url);
                let drinks = await drinks_response.json();
                drinks = drinks.drinks;
                
                console.log('Vald alkohol:', alcohol_select.value);
                console.log("1. drinkar med vald alkohol: ", drinks);


                //2. Slumpar fram en av drinkarna
                const random_index = Math.floor(Math.random() * drinks.length);
                const drink_id = drinks[random_index]['idDrink'];
                
                console.log("2. random_index: " + random_index);
                console.log("2. Drink id: " + drink_id);


            //3. Hämta info om valda drinken
            const lookup_url_part = '/lookup.php?i=';
            const lookup_url = base_url + lookup_url_part + drink_id;

            const details_response = await fetch(lookup_url);
            let drink = await details_response.json();
            drink = drink.drinks[0];

            console.log("3. Drink details: " + drink.strDrink);
            console.log(drink);


            console.log(drink.strIngredient1);
            
            //Gör en sammansatt array med unitz och ingredient
            const ingredients_list = get_ingredients_array(drink);
            console.log("array: " + ingredients_list);
            


            //Bygg upp elementen i html documentet
            recipe_container.innerHTML = `
                <h2>${drink.strDrink}</h2>

                <h3 class="recipe__ingredients" id="ingredients">Ingredients</h3>
                <ul class="recipe__ingredients-list" id="ingredients-list">
                    ${ingredients_list}
                </ul>

                <h3 class="recipe__instructions" id="instructions">Instructions</h3>
                <p class="recipe__instructions-text" id="instructions-text">${drink.strInstructions}</p>
            `;


            

        } catch (e) {

            console.error(e);
        }
    };

    get_drink();

});