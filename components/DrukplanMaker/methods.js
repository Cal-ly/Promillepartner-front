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

      const formattedTime = this.formatTime(spentTime.toFixed(0));

      this.drukplan.push({
        drink: currentDrink,
        pauseTime: formattedTime,
      });

      remainingTime -= interval;
      spentTime += interval;
      totalAlcoholScheduled += alcoholInGrams;

      drinkIndex = (drinkIndex + 1) % this.savedDrinks.length;
    }

    this.totalAlcoholMissing = Math.max(this.AlcoholInTotalGrams - totalAlcoholScheduled, 0).toFixed(2);
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
  async sendToPi() {
    try {
      // Validate the data before sending
      const data = this.convertDrinkPlanData();
      if (!data || !data.DrinkPlan || data.DrinkPlan.length === 0) {
        console.error("Invalid data, cannot send to API.");
        this.responseMessage = "Sending Data Failed: No valid data to send.";
        return;
      }
  
      console.log("Sending data to API:", data);
  
      // Send the POST request with the payload in the body
      const response = await axios.post(
        `https://localhost:7175/api/PromillePartnerPi/send_to_pi`, // API endpoint
        data, // Send the data as the request body
        {
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );
  
      // Handle successful response
      this.responseMessage = response.data;
      console.log("API Response:", response.data);
    } catch (error) {
      // Enhanced error handling
      const status = error.response?.status || "Unknown";
      const message = error.message || "An unknown error occurred";
      console.error(`Error sending data: Status ${status}, Message: ${message}`);
      this.responseMessage = `Sending Data Failed: Status ${status}, Message: ${message}`;
    } finally {
      // Reset data to avoid duplication when calling method again
      this.dataToSendToPie = [];
    }
  },
  
  convertDrinkPlanData() {
    // Validate the drukplan array
    if (!this.drukplan || this.drukplan.length === 0) {
      console.error("Drukplan is empty!");
      return null;
    }
  
    if (!this.PiIdentifier) {
      console.error("PiIdentifier is missing!");
      return null;
    }
  
    if (!this.dataToSendToPie) {
      this.dataToSendToPie = [];
    }
  
    let lastTimeInSeconds = 0;
  
    // Calculate the time differences for the drink plan
    this.drukplan.forEach((t) => {
      const currentTimeInSeconds = this.timeToSeconds(t.pauseTime); // Ensure t.pauseTime is used
      const timeDifference = currentTimeInSeconds - lastTimeInSeconds;
      if (timeDifference < 0) {
        console.warn(`Skipping invalid time difference: ${timeDifference}`);
        return;
      }
      this.dataToSendToPie.push({ TimeDifference: timeDifference }); // Update to create an object per entry
      lastTimeInSeconds = currentTimeInSeconds; // Update lastTimeInSeconds for the next iteration
    });
  
    // Construct the payload to match the API schema
    const data = {
      Identifier: this.PiIdentifier, // Matches the API's property
      DrinkPlan: this.dataToSendToPie, // Should be a list of objects with TimeDifference
    };
  
    console.log("Prepared data for API:", data);
  
    return data;
  }
  
};
