<template>
  <div class="random-cocktail">
    <h2>Tilfældig Cocktail</h2>
    <button @click="fetchRandomCocktail">Hent en tilfældig cocktail</button>

    <div v-if="cocktail" class="cocktail-details">
      <h3>{{ cocktail.strDrink }}</h3>
      <img :src="cocktail.strDrinkThumb" :alt="cocktail.strDrink" />
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
</template>

<script>
export default {
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
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        this.cocktail = data.drinks[0];
      } catch (error) {
        console.error("Fejl ved hentning af cocktail:", error);
      }
    },
  },
};
</script>

<style scoped>
.random-cocktail {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.random-cocktail button {
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.random-cocktail button:hover {
  background-color: #0056b3;
}

.cocktail-details {
  margin-top: 20px;
}

.cocktail-details img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.cocktail-details ul {
  list-style-type: none;
  padding: 0;
}

.cocktail-details li {
  background-color: #fff;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
