const PromilleCalculator = {
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
          <input type="number" id="targetPromille" v-model.number="targetPromille" step="0.01" required />
  
          <label for="hours">Antal timer:</label>
          <input type="number" id="hours" v-model.number="hours" required />
  
          <button type="submit">Beregn</button>
        </form>
  
        <div v-if="result !== null" class="result">
          <h3>Resultat</h3>
          <p>Du skal drikke ca. <strong>{{ result }}</strong> genstand(e) i timen for at nå din ønskede promille.</p>
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
      };
    },
    methods: {
      calculate() {
        const alcoholDistributionFactor = this.gender === "male" ? 0.7 : 0.6; // Mand: 0.7, Kvinde: 0.6
        const standardDrinkAlcohol = 12; // Alkohol i gram per genstand
  
        // Beregning af antal genstande i timen
        const requiredAlcohol = (this.targetPromille * this.weight * alcoholDistributionFactor) 
                                + (0.15 * this.weight * this.hours); 
        const drinksPerHour = requiredAlcohol / (standardDrinkAlcohol * this.hours);
  
        this.result = Math.max(0, drinksPerHour.toFixed(2)); // Ingen negative værdier
      },
    },
  };
  
  export default PromilleCalculator;
  