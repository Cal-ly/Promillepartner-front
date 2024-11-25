import PromilleCalculator from "./components/PromilleCalculator.vue";
import RandomCocktail from './components/RandomCocktail.vue';

const { createApp } = Vue;

const app = createApp({
    components: {
      PromilleCalculator,
      RandomCocktail,
    },
  });

app.mount("#app");
