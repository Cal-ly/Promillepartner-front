export const methods = {
    calculate() {
      const alcoholDistributionFactor = this.gender === "male" ? 0.7 : 0.6;
      const standardDrinkAlcohol = 12;
      const nedbrydningsHastighed = 0.15;
      const requiredAlcohol =
        this.targetPromille * this.weight * alcoholDistributionFactor +
        nedbrydningsHastighed * this.weight * this.hours;
      this.standardDrinksInTotal = requiredAlcohol;
      this.standardDrinksPerHour =
        requiredAlcohol / (standardDrinkAlcohol * this.hours);
    },
  
    async getPersonByID() {
      try {
        const response = await axios.get(
          `https://promillepartnerbackend.azurewebsites.net/api/person/${this.searchPersonID}`
        );
        this.personData = response.data;
      } catch (ex) {
        alert(ex.message);
      }
    },
  
    async getDrinks() {
      try {
        const response = await axios.get(
          `https://promillepartnerbackend.azurewebsites.net/api/drink`
        );
        this.drinks = response.data;
      } catch (error) {
        console.error("Error fetching drinks:", error);
      }
    },
  
    saveDrinks() {
      this.savedDrinks = this.selectedDrinks;
    },
  };  