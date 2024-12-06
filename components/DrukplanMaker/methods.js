export default {
  calculate() {
    console.log("Start på calcc")
    const alcoholDistributionFactor = this.personData.gender === "male" ? 0.7 : 0.6; // Mand: 0.7, Kvinde: 0.6
    const standardDrinkAlcohol = 12; // Alkohol i gram per genstand
    const nedbrydningsHastighed = 0.15;

    const requiredAlcohol =
      this.targetPromille * this.personData.weight * alcoholDistributionFactor +
      nedbrydningsHastighed * this.personData.weight * this.hours;

    this.AlcoholInTotalGrams = Math.max(requiredAlcohol.toFixed(2));
    this.standardDrinksPerHour = Math.max((requiredAlcohol / (standardDrinkAlcohol * this.hours).toFixed(2)));
  },

  async saveSettings() {
    console.log("Saving settings");
    await this.getPersonByID();
    this.saveDrinks();
    console.log("Settings saved");
    this.calculate();
  },

  async getPersonByID() {
    try {
      const response = await axios.get(
        `https://promillepartnerbackend.azurewebsites.net/api/person/${this.searchPersonID}`
      );
      this.personData = response.data;
      console.log("Person data:", this.personData);
    } catch (ex) {
      alert(ex.message);
    }
  },

  async fetchPersonAndShowModal() {
    try {
      const response = await axios.get(
        `https://promillepartnerbackend.azurewebsites.net/api/person/${this.searchPersonID}`
      );
      this.personData = response.data;
      console.log("Person data:", this.personData);
      console.log("Gender value:", this.personData.man);

      // Show the modal only after successful data fetching
      const modal = new bootstrap.Modal(
        document.getElementById('personInfoModal')
      );
      modal.show();


    } catch (ex) {
      alert(ex.message);
    }
  },

  async getDrinks() {
    console.log("Fetching drinks");
    try {
      const response = await axios.get(`https://promillepartnerbackend.azurewebsites.net/api/drink`);
      this.drinks = response.data;
    } catch (error) {
      console.error("Error fetching drinks:", error);
    }
  },

  saveDrinks() {
    console.log("Selected drinks:", this.selectedDrinks);
    this.savedDrinks = this.selectedDrinks;
    console.log("Saved drinks(fr this time):", this.savedDrinks);
  },

  createDrinkPlan() {
    console.log("drinks for Drinkplan:", this.savedDrinks);
    const densityOfAlcohol = 7.89; // grams/ml alcohol density
    const drinkIntervals = this.savedDrinks.map(drink =>
      ((drink.volume * drink.alcoholPercentOfVolume * densityOfAlcohol) / this.AlcoholInTotalGrams) *
      this.hours * 60);

    this.drukplan = [];
    let remainingTime = this.hours * 60;
    let spentTime = 0;
    let drinkIndex = 0;
    let totalAlcoholScheduled = 0;

    while (remainingTime > 0) {
      const currentDrink = this.savedDrinks[drinkIndex];
      const interval = drinkIntervals[drinkIndex];
      const alcoholInGrams = currentDrink.volume * currentDrink.alcoholPercentOfVolume * densityOfAlcohol;

      if (remainingTime < interval) break;

      const formattedTime = this.formatTime(spentTime);


      this.drukplan.push({
        drink: currentDrink,
        pauseTime: formattedTime,
      });

      remainingTime -= interval;
      spentTime += interval;
      totalAlcoholScheduled += alcoholInGrams;

      drinkIndex = (drinkIndex + 1) % this.savedDrinks.length;
    }

    this.totalAlcoholMissing = Math.max(this.AlcoholInTotalGrams - totalAlcoholScheduled, 0);
  },

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins}`;
  },
  timeToSeconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60; // Convert hours and minutes to seconds
  },
  sendToPi() {
    if (!this.dataToSendToPie) {
      this.dataToSendToPie = [];
    }
    
    let lastTimeInSeconds = 0;

    this.drukplan.forEach(t => {
      const currentTimeInSeconds = this.timeToSeconds(t.pauseTime); // Use t.pauseTime instead of t.formattedTime
      const timeDifference = currentTimeInSeconds - lastTimeInSeconds;
      this.dataToSendToPie.push(timeDifference);
      lastTimeInSeconds = currentTimeInSeconds; // Update lastTimeInSeconds for the next iteration
    });

    console.log(this.dataToSendToPie);
  },
};
