export default {
  template: `
    <div class="random-cocktail">
      <h2>Tilfældig Cocktail</h2>
      <button @click="fetchRandomCocktail">Hent en tilfældig cocktail</button>
      <div v-if="cocktail" class="cocktail-details">
        <h3>{{ cocktail.strDrink }}</h3>
        <img :src="cocktail.strDrinkThumb" :alt="cocktail.strDrink" style="width: 150px; height: 150px;" />
        <p><strong>Kategori:</strong> {{ cocktail.strCategory }}</p>
        <p><strong>Type:</strong> {{ cocktail.strAlcoholic }}</p>
        <p><strong>Glas:</strong> {{ cocktail.strGlass }}</p>
        <h4>Ingredienser:</h4>
        <ul>
          <li v-for="(ingredient, index) in ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
        <h4>Instruktioner:</h4>
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
