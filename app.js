import PromilleCalculator from './components/PromilleCalculator.js';
import RandomCocktail from './components/RandomCocktail.js';
import RestPersonInformation from './components/RestPersonInformation.js';

const app = Vue.createApp({
  components: {
    PromilleCalculator,
    RandomCocktail,
    RestPersonInformation,
  },
});

app.mount('#app');

