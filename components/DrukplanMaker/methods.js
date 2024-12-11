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
    console.log("Validating settings");
     // Check if drinks list is empty
  if (this.selectedDrinks.length === 0) {
    this.errorMessage = "Din drinkliste er tom. Vælg venligst nogle drinks.";
    console.log(this.errorMessage);
    return; // Stop the process
  }
  if (this.targetPromille < 0) {
    this.errorMessage = "Invalid ønsket promille. Din promille kan ikke være negativ.";
    console.log(this.errorMessage);
    return; // Stop the process
  } 
if (this.targetPromille > 4) {
  this.errorMessage = "Din ønskede promille er for høj. Din promille kan ikke være over 4.";
  console.log(this.errorMessage);
  return; // Stop the process
}

if (this.hours < 0) {
  this.errorMessage = "Invalid drukplan længde. Drukplan længde kan ikke være negativ.";
  console.log(this.errorMessage);
  return; // Stop the process
}

if (this.startPromille < 0) {
  this.errorMessage = "Invalid start promille. Din promille kan ikke være negativ.";
  console.log(this.errorMessage);
  return; // Stop the process
}
if (this.startPromille > 4) {
  this.errorMessage = "Din start promille er for høj. Din promille kan ikke være over 4.";
  console.log(this.errorMessage);
  return; // Stop the process
}
// if () {
//   this.errorMessage = "Person data er ikke blevet hentet. Indtast venligst en gyldig person ID.";
//   console.log(this.errorMessage);
//   return; // Stop the process
// }
  

    this.errorMessage = ""; // Clear the error message if no error
    console.log("Saving settings");
    await this.getPersonByID();
      this.saveDrinks();
      console.log("Settings saved");
      this.calculate();
      this.createDrinkPlan(); // Create the drink plan after saving settings
    
      
    
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

  async createDrinkPlan() {
    console.log("drinks for Drinkplan:", this.savedDrinks);
    const densityOfAlcohol = 7.89; // grams/ml alcohol density
    const drinkIntervals = this.savedDrinks.map(drink =>
      ((drink.volume * drink.alcoholPercentOfVolume * densityOfAlcohol) / this.AlcoholInTotalGrams) *
      this.hours * 60);

    this.drukplan = [];
    this.totalAlcoholScheduled = 0;
    let remainingTime = this.hours * 60;
    let spentTime = 0;
    let drinkIndex = 0;
    

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
      this.totalAlcoholScheduled += alcoholInGrams;

      drinkIndex = (drinkIndex + 1) % this.savedDrinks.length;
    }

    this.totalAlcoholMissing = Math.max(this.AlcoholInTotalGrams - this.totalAlcoholScheduled, 0).toFixed(2);
    this.totalAlcoholScheduled = this.totalAlcoholScheduled.toFixed(2);
  },

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60).toString().padStart(2, '0'); // Ensure two digits for minutes
    return `${hours}:${mins}`;
  },
  timeToSeconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60; // Convert hours and minutes to seconds
  },
  async sendToPi() {
    try {
      // Validate the data before sending
      

      const response2 = await axios.post(`https://promillepartnerbackend.azurewebsites.net/api/drinkplan`, this.convertDrinkPlanData(), {
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
      }
    );
  
      // Handle successful response
      this.responseMessage = response2.data;
      console.log("API Response:", response2.data);
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
    let iterator = 0;
    this.drukplan.forEach((t) => {
      iterator = 1 + iterator
      const currentTimeInSeconds = this.timeToSeconds(t.pauseTime); // Ensure t.pauseTime is used
      const timeDifference = currentTimeInSeconds - lastTimeInSeconds;
      if (timeDifference < 0) {
        console.warn(`Skipping invalid time difference: ${timeDifference}`);
        return;
      }
      this.dataToSendToPie.push({ timeDifference: timeDifference, drinkName: t.drink.name }); // Update to create an object per entry
      lastTimeInSeconds = currentTimeInSeconds; // Update lastTimeInSeconds for the next iteration
    });
  
    // Construct the payload to match the API schema
    const data = {
      identifier: this.PiIdentifier, // Matches the API's property
      drinkPlanen: this.dataToSendToPie, // Should be a list of objects with TimeDifference
      timeStamp: this.timeStart, // Update to call the function
    };
  
    console.log("Prepared data for API:", data);
  
    return data;
  },

  // Function to update current time display
updateCurrentTime() {
  const now = new Date();
  this.timeStart = now.getTime();
  console.log(this.timeStart);
},
  
  async saveDrinkPlanToDatabase() {
    const response = await axios.post(`https://localhost:7175/api/DrinkPlan`, data = this.DrinkPlan, {
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
      }
    );
  }
};
