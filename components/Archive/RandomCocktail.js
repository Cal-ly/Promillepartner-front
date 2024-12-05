export default {
  template: `
    <div class="random-cocktail">
      <h2 id="RandomCocktailHeader">Tilfældig Cocktail</h2>
      <button id="buttonGetRandomDrink" @click="fetchRandomCocktail">Hent en tilfældig cocktail</button>
      <div id="divFoundDrink" v-if="cocktail" class="cocktail-details">
        <h3 id="headerFoundDrink">{{ cocktail.strDrink }}</h3>
        <img id="imageFoundDrink" :src="cocktail.strDrinkThumb" :alt="cocktail.strDrink" style="width: 150px; height: 150px;" />
        <p id="drinkCategory"><strong>Kategori:</strong> {{ cocktail.strCategory }}</p>
        <p id="containAlcohol"><strong>Type:</strong> {{ cocktail.strAlcoholic }}</p>
        <p> id="servingGlass"<strong>Glas:</strong> {{ cocktail.strGlass }}</p>
        <h4 id="headerIngredients">Ingredienser:</h4>
        <ul id="unorderedIngredientList">
          <li v-for="(ingredient, index) in ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
        <h4 id="instructionList">Instruktioner:</h4>
        <p>{{ cocktail.strInstructions }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      cocktail: null,
    };
  },
  computed: {
    ingredients() {
      if (!this.cocktail) return [];
      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = this.cocktail[`strIngredient${i}`];
        const measure = this.cocktail[`strMeasure${i}`];
        if (ingredient) {
          ingredients.push(`${ingredient}${measure ? ` - ${measure}` : ""}`);
        }
      }
      return ingredients;
    },
  },
  methods: {
    async fetchRandomCocktail() {
      try {
        const response = await axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );
        this.cocktail = response.data.drinks[0];
      } catch (error) {
        console.error("Fejl ved hentning af cocktail:", error);
      }
    },
  },
};
