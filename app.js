import PromilleCalculator from './components/PromilleCalculator.js';
import RandomCocktail from './components/RandomCocktail.js';

const app = Vue.createApp({
  components: {
    PromilleCalculator,
    RandomCocktail,
  },
});

app.mount('#app');

