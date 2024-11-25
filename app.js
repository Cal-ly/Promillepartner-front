import PromilleCalculator from "./components/PromilleCalculator.js";

const { createApp } = Vue;

const app = createApp({
  components: {
    PromilleCalculator,
  },
  data() {
    return {
      drinks: [],
    };
  },
  methods: {
    async fetchDrinks() {
      try {
        const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        this.drinks = data.drinks.map(drink => ({
          id: drink.idDrink,
          name: drink.strDrink,
        }));
      } catch (error) {
        console.error("Error fetching drinks:", error);
      }
    },
  },
});

app.mount("#app");
