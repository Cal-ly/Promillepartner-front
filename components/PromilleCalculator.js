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

      //simpel version, advancerede skal være man kan kun tilføje drinks indefor totalalcohol 
      //+ hvis den overstiger ændre tiden også i drukplanen for at udligne
      if (this.totalAlcohol > this.forventedAlkohol)
        { 
          for (let i = 0; i < this.savedDrinks.length; i++) 
          {
            let temp = this.retrievedDrinks.find(d => d.name == this.savedDrinks[i]);
            console.log(temp)
            this.forventedAlkohol += temp.volume * temp.alcoholPercentOfVolume * 7,89
          } 
        }

        this.forventedAlkohol = this.forventedAlkohol.toFixed(2)

        
      // = this.savedDrinks.forEach(sD => this.retrievedDrinks.find(rD => rD.name == sD).volume)
    },
    removeFromDrinkList(index) {
      this.savedDrinks.indexOf(index)
      //this.savedDrinks = delete this.savedDrinks[index]
      const index2 = this.savedDrinks.indexOf(sD => sD.id == index);
      if (index2 > -1) { // only splice array when item is found
        this.savedDrinks = this.savedDrinks.splice(index2 -1, 1); // 2nd parameter means remove one item only
      }
    },
  },
  mounted() {
    this.showAllDrinks();
  }
};
