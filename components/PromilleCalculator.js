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
        <input id="targetPromilleInput" type="number" v-model.number="targetPromille" step="0.01" required />

        <label id="hoursInputLabel" for="hoursInput">Antal timer:</label>
        <input id="hoursInput" type="number" v-model.number="hours" required />

        <button id="buttonBeregn" type="submit">Beregn</button>
      </form>

      <div id="promilleResultDivision" v-if="result !== null" class="result">
        <h3 id="resultHeader">Resultat</h3>
        <p id="resultText">
          Du skal drikke ca. <strong>{{ result }}</strong> genstand(e) i timen
          for at nå din ønskede promille.
          Forventet alkohol drukket: {{ totalAlcohol }} gram.
        </p>

        <select id="dropDownSelectDrinks" v-model="selectedDrinks" multiple>
          <option v-for="item in retrievedDrinks" :key="item.id">{{ item.name }}</option>
        </select>
        <button id="buttonGenererDrukplan" @click="generateDrinkPlan">Generer drukplan</button>

        <div>
          <table id="tableDrukplan" class="table">
            <thead id="tableHeaderDrukplan" class="thead-dark">
              <tr>
                <th>Tid</th>
                <th>Drink</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="drink in drukplan" :key="drink.drink.id">
                <td>{{ drink.pauseTime }}</td>
                <td>{{ drink.drink.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>


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
      selectedDrinks: [],
      drukplan: [],

    };
  },
  methods: {
    // Calls APi to get data and save in 'retrievedDrinks'
    async fetchAllDrinks() {
      try {
        const response = await axios.get("https://promillepartnerbackend.azurewebsites.net/api/drink");
        this.retrievedDrinks = response.data;
      } catch (error) {
        alert(`Error fetching drinks: ${error.message}`);
      }
    },
    // calculates the amount of alcohol intake is required to reach the desired promille
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
    // generates a drink plan with the marked items that is to be included in the plan
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
    // creates a drink plan with time, items etc based on argument of drinks it is to be created with.
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
  },
  mounted() {
    this.fetchAllDrinks();
  },
};

