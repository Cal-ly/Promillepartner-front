export const computed = {
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
  };
  