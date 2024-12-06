import DrukplanMaker from './components/DrukplanMaker/index.js';
import Person from './components/Person/index.js';
import RandomCocktail from './components/RandomCocktail/index.js';

const app = Vue.createApp({
  components: {
    DrukplanMaker,
    Person,
    RandomCocktail,
  },
});

app.mount('#app');