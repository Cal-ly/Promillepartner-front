import template from './template.js';
import data from './data.js';
import methods from './methods.js';
import mountedLogic from './mounted.js';

export default {
  template,
  data() {
    return data(); // Now calling the function to get the data
  },
  methods,
  mounted() {
    // Call the mounted logic from the imported module
    mountedLogic.mounted.call(this);
  },
  computed: {
    selectedDrinksPlaceholder() {
      if (this.selectedDrinks.length === 0) {
        return "Vis listen"; // Default placeholder text
      }
      return this.selectedDrinks.map(drink => drink.name).join(", "); // Selected drinks' names
    }
  }
};