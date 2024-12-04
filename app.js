import PromilleCalculator from './components/PromilleCalculator.js';
import RandomCocktail from './components/RandomCocktail.js';
import RestPersonInformation from './components/RestPersonInformation.js';
import Drukplan from './components/Drukplan.js';

const app = Vue.createApp({
  components: {
    PromilleCalculator,
    RandomCocktail,
    RestPersonInformation,
    Drukplan,
  },
});

app.mount('#app');

