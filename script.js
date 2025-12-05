
//---- URL ----//
const base_url = 'https://www.thecocktaildb.com/api/json/v1/1';

//---- DOM ----//
const alcohol_select = document.getElementById('alcohol_select');
const search_button = document.getElementById('search_button');
// const drink_name_element = document.getElementById('drink-name');
// const ingredients_list = document.getElementById('ingredients-list');


//---- FUNKTIONER ----//
function insertText(element_id, text){

    const element = document.getElementById(element_id);

    if (element.textContent === '') {
        element.textContent = text;
    } else {
        element.textContent = text;
    }
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

            console.log("3. Drink details: " + drink['strDrink']);
            console.log(drink);


            const drink_name = drink['strDrink'];
            const drink_instructions = drink['strInstructions'];

            insertText('drink-name', drink_name);
            insertText('instructions-text', drink_instructions);
            

        } catch (e) {

            console.error(e);
        }
    };

    get_drink();

});