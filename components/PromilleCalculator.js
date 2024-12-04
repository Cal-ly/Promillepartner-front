export default {
  template: `
    <div class="calculator">
      <h2>Promille Beregner</h2>
      <form @submit.prevent="calculate">
        <label for="gender">Køn:</label>
        <select id="gender" v-model="gender">
          <option value="male">Mand</option>
          <option value="female">Kvinde</option>
        </select>
        <label for="age">Alder:</label>
        <input type="number" id="age" v-model.number="age" required />
        <label for="weight">Vægt (kg):</label>
        <input type="number" id="weight" v-model.number="weight" required />
        <label for="targetPromille">Slutpromille:</label>
        <input
          type="number"
          id="targetPromille"
          v-model.number="targetPromille"
          step="0.01"
          required
        />
        <label for="hours">Antal timer:</label>
        <input type="number" id="hours" v-model.number="hours" required />
        <button type="submit">Beregn</button>
      </form>
      <div v-if="result !== null" class="result">
        <h3>Resultat</h3>
        <p>
          Du skal drikke ca. <strong>{{ result }}</strong> genstand(e) i timen
          for at nå din ønskede promille.
          forventet alkohol drukket {{ totalAlcohol }}gram

        </p>
      </div>
    </div>
    <div v-if="result != null">
      <select id="dropDownSelectDrinks" v-model="selectedDrinks" multiple>
        <option  v-for="item in retrievedDrinks">{{ item.name }}</option>
      </select>
      <button v-on:click="addToDrinkList">Tilføj</button>

      <!-- DISPLAY DRINKS IN DRINKING PLAN -->
      <ul>
        <li v-for="(item, index) in savedDrinks" :key="index">
          {{ item.name }} 
          {{ item.id }} 
          <!-- DELETE METHOD FOR DRINKS IN DRINKING PLAN -->
          <button v-on:click="removeFromDrinkList(item.id)">Delete</button>
        </li>
      </ul>

      <p>{{forventedAlkohol}}</p>

      
      <!--<ul>
            <li v-for="item in retrievedDrinks">{{ item.volume }} liter of {{item.name}} contains {{ item.volume * item.alcoholPercentOfVolume * 7,89 }} gram alcohol</li>
          </ul>-->
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
