import DrukplanMaker from './components/DrukplanMaker/index.js';
import Person from './components/Person/index.js';
import PromilleCalculator from './components/PromilleCalculator/index.js';
import RandomCocktail from './components/RandomCocktail/index.js';

const app = Vue.createApp({
  components: {
    DrukplanMaker,
    Person,
    PromilleCalculator,
    RandomCocktail,
  },
});

app.mount('#app');