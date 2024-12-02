export default {
  template: `
    <div class="calculator">
      <h2 id="PromilleBeregnerHeader">Promille Beregner</h2>
      <form id="PromilleBeregnerForm" @submit.prevent="calculate">
        <label id="genderLabel" for="gender">Køn:</label>
        <select id="genderSelect" v-model="gender">
          <option id="genderSelectMale" value="male">Mand</option>
          <option id="genderSelectFemale" value="female">Kvinde</option>
        </select>
        <label id="ageInputLabel" for="ageInput">Alder:</label>
        <input id="ageInput" type="number" v-model.number="age" required />
        <label id="weightInputLabel" for="weightInput">Vægt (kg):</label>
        <input id="weightInput" type="number" v-model.number="weight" required />
        <label id="targetPromilleInputLabel" for="targetPromilleInput">Slutpromille:</label>
        <input
          id="targetPromilleInput"
          type="number"
          v-model.number="targetPromille"
          step="0.01"
          required
        />
        <label id="hoursInputLabel" for="hoursInput">Antal timer:</label>
        <input id="hoursInput" type="number" id="hours" v-model.number="hours" required />
        <button id="buttonBeregn" type="submit">Beregn</button>
      </form>
      <div id="promilleResultDivision" v-if="result !== null" class="result">
        <h3 id="resultHeader">Resultat</h3>
        <p id="resultText">
          Du skal drikke ca. <strong>{{ result }}</strong> genstand(e) i timen
          for at nå din ønskede promille.
          forventet alkohol drukket {{ totalAlcohol }} gram

        </p>
        <select id="dropDownSelectDrinks" v-model="selectedDrinks" multiple>
          <option  v-for="item in retrievedDrinks">{{ item.name }}</option>
        </select>
        <button id="buttonGenererDrukplan" v-on:click="addToDrinkList">Generer drukplan</button>


        <table id="tableDrukplan" class="table">
          <tr id="tableHeaderDrukplan" class="thead-dark">
            <th>Tid</th>
            <th>Drink</th>
          </tr>
          <tr v-for="drink in drukplan">
            <td>{{ drink.pauseTilNæsteDrink }}</td>
            <td>{{ drink.drink.name}}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  data() {
    return {
      gender: "male",
      age: 18,
      weight: 70,
      targetPromille: 0.0,
      hours: 1,
      result: null,
      totalAlcohol: 0,
      retrievedDrinks: [],
      loadedData: false,
      selectedDrinks: [],
      savedDrinks: [],
      forventedAlkohol: 0,
      drukplan: [],
    };
  },
  methods: {
    async showAllDrinks() {
      try {
        const response = await axios.get("https://promillepartnerbackend.azurewebsites.net/api/drink");
        this.retrievedDrinks = response.data;
        return this.retrievedDrinks; // Return the fetched data
      } catch (ex) {
        alert(ex.message);
      }
    },
    calculate() {
      const alcoholDistributionFactor = this.gender === "male" ? 0.7 : 0.6; // Mand: 0.7, Kvinde: 0.6
      const standardDrinkAlcohol = 12; // Alkohol i gram per genstand
      const nedbrydningsHastighed = 0.15;
      console.log(this.selectedDrinks)
      const requiredAlcohol =
        this.targetPromille * this.weight * alcoholDistributionFactor +
        nedbrydningsHastighed * this.weight * this.hours;
      this.showAllDrinks();
      this.totalAlcohol = requiredAlcohol;
      const drinksPerHour = requiredAlcohol / (standardDrinkAlcohol * this.hours);
      this.result = Math.max(0, drinksPerHour.toFixed(2)); // Ingen negative værdier
    },
    addToDrinkList() {
      this.selectedDrinks //selected drinks from select element
      this.selectedDrinks.forEach(d => this.savedDrinks.push({name: d, id:this.savedDrinks.length }))
      this.forventedAlkohol = 0
      this.DistributeAlcohol()
    },
    DistributeAlcohol() {
      // Retrieve selected drinks
      let actualDrinks = this.retrievedDrinks.filter(d => this.selectedDrinks.includes(d.name));
  
      console.log("Selected drinks:", actualDrinks);
  
      if (actualDrinks.length === 0 || this.hours <= 0) {
          console.error("No drinks to distribute or invalid duration.");
          return;
      }
  
      const densityOfAlcohol = 7.89;
      const drinkIntervals = []; // Time intervals for each drink in minutes
  
      // Calculate drinking intervals for each selected drink
      for (let drink of actualDrinks) {
          const interval = ((drink.volume * drink.alcoholPercentOfVolume * densityOfAlcohol) / this.totalAlcohol) * this.hours * 60;
          drinkIntervals.push(interval);
      }
  
      let positionInActualDrinks = 0;
      this.drukplan = [];
      let restTime = this.hours * 60;
      let spentTime = 0;
  
      while (restTime > 0) {
          const currentDrink = actualDrinks[positionInActualDrinks];
          const interval = drinkIntervals[positionInActualDrinks];
  
          if (restTime < interval) break; // Stop if remaining time is less than the current interval
  
          // Calculate next pause time
          var d = new Date();
          //d.setHours(1, spentTime, 0, 0); // Start at midnight and add spent time
          d.setUTCHours(0,spentTime,0,0)

          //if (d.getHours() == 23){
          //  console.log("It Worked! The time has been changed")
          //  d.setHours(10,spentTime,0,0)
          //}

          // Format time as HH:MM:SS
          const formattedTime = d.toISOString().substr(11, 8);

          restTime -= interval;
          spentTime += interval;
  
          this.drukplan.push({
              drink: currentDrink,
              pauseTilNæsteDrink: formattedTime
          });
  
          // Move to the next drink
          positionInActualDrinks = (positionInActualDrinks + 1) % actualDrinks.length;
      }
  
      console.log("Drinking Plan:", this.drukplan);
  },
  },
  mounted() {
    this.showAllDrinks();
  }
};
