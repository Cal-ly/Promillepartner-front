export const methods = {
    // Calls API to get data and save in 'retrievedDrinks'
    async fetchAllDrinks() {
      try {
        const response = await axios.get("https://promillepartnerbackend.azurewebsites.net/api/drink");
        this.retrievedDrinks = response.data;
      } catch (error) {
        alert(`Error fetching drinks: ${error.message}`);
      }
    },
  
    // Calculates the amount of alcohol intake required to reach the desired promille
    calculate() {
      const alcoholDistributionFactor = this.gender === "male" ? 0.7 : 0.6;
      const standardDrinkAlcohol = 12; // grams of alcohol per standard drink
      const burnRate = 0.15; // Alcohol breakdown rate (g/h/kg)
  
      const alcoholRequired =
        this.targetPromille * this.weight * alcoholDistributionFactor +
        burnRate * this.weight * this.hours;
  
      this.totalAlcohol = alcoholRequired;
      const drinksPerHour = alcoholRequired / (standardDrinkAlcohol * this.hours);
      this.result = Math.max(0, drinksPerHour.toFixed(2));
    },
  
    // Generates a drink plan with the marked items that are to be included in the plan
    generateDrinkPlan() {
      const selectedDrinks = this.retrievedDrinks.filter(drink =>
        this.selectedDrinks.includes(drink.name)
      );
  
      if (!selectedDrinks.length || this.hours <= 0) {
        console.error("No drinks selected or invalid duration.");
        return;
      }
  
      this.createDrinkPlan(selectedDrinks);
    },
  
    // Creates a drink plan with time, items, etc., based on argument of drinks to be included
    createDrinkPlan(selectedDrinks) {
      const densityOfAlcohol = 7.89; // grams/ml alcohol density
      const drinkIntervals = selectedDrinks.map(drink =>
        ((drink.volume * drink.alcoholPercentOfVolume * densityOfAlcohol) / this.totalAlcohol) *
        this.hours * 60);
  
      this.drukplan = [];
      let remainingTime = this.hours * 60;
      let spentTime = 0;
      let drinkIndex = 0;
  
      while (remainingTime > 0) {
        const currentDrink = selectedDrinks[drinkIndex];
        const interval = drinkIntervals[drinkIndex];
  
        if (remainingTime < interval) break;
  
        const formattedTime = this.formatTime(spentTime);
  
        this.drukplan.push({
          drink: currentDrink,
          pauseTime: formattedTime,
        });
  
        remainingTime -= interval;
        spentTime += interval;
        drinkIndex = (drinkIndex + 1) % selectedDrinks.length;
      }
    },
  
    formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    },
  };
  