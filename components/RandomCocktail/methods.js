export const methods = {
    async fetchRandomCocktail() {
      try {
        const response = await axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );
        this.cocktail = response.data.drinks[0];
      } catch (error) {
        console.error("Fejl ved hentning af cocktail:", error);
      }
    },
  };
  