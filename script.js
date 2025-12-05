
const base_url = 'https://www.thecocktaildb.com/api/json/v1/1';

const alcohol_select = document.getElementById('alcohol_select');
const search_button = document.getElementById('search_button');


search_button.addEventListener('click', () => {
    console.log('Vald alkohol:', alcohol_select.value);
    
    const alcohol_type = alcohol_select.value;
    
    const get_drink = async () => {

        try {

            //1. Tar fram drinkar som innehåller vald alkohol
            const filter_url_part = '/filter.php?i=';
            const filter_url = base_url + filter_url_part + alcohol_type;
            
            const drinks_response = await fetch(filter_url);
            const drinks = await drinks_response.json();
            
            console.log("1. drinkar med vald alkohol: ", drinks);

            //2. Slumpar fram en av drinkarna
            const random_index = Math.floor(Math.random() * drinks.drinks.length);
            console.log("2. random_index: " + random_index);

            const drink_id = drinks.drinks[random_index]['idDrink'];

            console.log("2. Drink id: " + drink_id);


            //3. Hämta info om valda drinken
            const lookup_url_part = '/lookup.php?i=';
            const lookup_url = base_url + lookup_url_part + drink_id;

            const details_response = await fetch(lookup_url);
            const drink = await details_response.json();

            console.log("3. Drink details: " + drink.drinks[0]['strDrink']);

            const name = drink.drinks[0]['strDrink'];
            

        } catch (e) {

            console.error(e);
        }
    };

    get_drink();

});