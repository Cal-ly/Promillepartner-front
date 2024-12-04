export default {
    template: `
      <div class="drukplanMaker">
        <!-- Overskrift -->
        <div class="container mt-4">
            <h1>Din Drukplan</h1>
            <p>Vælg dine personlige oplysning og få din helt egen personlige drukplan generet til dig!</p>
        </div>

    <!-- Custom Settings -->
        <div class="container mt-4">
            <div class="custom-settings">
            <div>
                <label id="getPersonalInformationInputLabel" for="getPersonalInformationInput">Hent personinformationer</label>
                <input type="number" id="search-person-id" class="form-control" value="0" v-model="searchPersonID" placeholder="Indtast ID på gemte person">
                <button class="btn btn-primary save-button" v-on:click="getPersonByID">Hent oplysninger</button>       
</div>
            <div>
                <label for="current-promille" class="form-label mt-3">Nuværende promille:</label>
                <input type="number" id="current-promille" v-model.number="startPromille" class="form-control" value="0">
            </div>
            <div>
                <label id="targetPromilleInputLabel" class="form-label mt-3" for="targetPromilleInput">Ønsket promille:</label>
                <input
                id="targetPromilleInput"
                type="number"
                v-model.number="targetPromille"
                step="0.01"
                required
                value="0"
                class="form-control"
                />
            </div>
            <div>
                <label id="hoursInputLabel" class="form-label mt-3" for="hoursInput">Længde af drukplan:</label>
                <input id="hoursInput" type="number" class="form-control" id="hours" v-model.number="hours" required placeholder="I timer"/>
            
            </div>
            <div>
            <label for="drinks" class="form-label mt-3">Vælg drinks fra listen:</label>
                <input
                 type="text"
                 class="form-control mb-3"
                placeholder="Vis listen"
                 readonly
                data-bs-toggle="modal"
                  data-bs-target="#drinksModal"
            />
                <button class="btn btn-primary save-button" @click="saveSettings" >Gem
                </button>
                <button class="btn btn-primary save-button" @click="createDrinkPlan" >Druk
                </button>
                
            </div>
        </div>

        <!-- Drinks Modal -->
    <div
      class="modal fade"
      id="drinksModal"
      tabindex="-1"
      aria-labelledby="drinksModalLabel"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="drinksModalLabel">Vælg dine drinks</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Dynamically render drinks -->
            <div
              class="form-check"
              v-for="drink in drinks"
              :key="drink.id"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="'drink-' + drink.id"
                v-model="selectedDrinks"
                :value="drink"
              />
              <label
                class="form-check-label"
                :for="'drink-' + drink.id"
              >
                {{ drink.name }}
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              @click="saveDrinks"
              data-bs-dismiss="modal"
            >
              ✓ Save
            </button>
          </div>
        </div>
      </div>
    </div>
        
        <!-- Summary Section -->
        <div class="container mt-4">
            <div class="container mt-4 text-center">
                <p class="fw-bold">
                    Du skal drikke {{standardDrinksPerHour}} genstande i timen, som svarer til {{AlcoholInTotalGrams}} gram alkohol i alt.
                </p>
                <p class="fw-bold">
                    Din promille vil være {{targetPromille}} om {{hours}} timer!
            </div>
            
        </div>

       <!-- Table Section -->
<div class="container mt-4">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Tid</th>
                <th>Drik</th>
                <th>Mængde</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="drink in drukplan" :key="drink.drink.name">
                <td>{{ drink.pauseTime }}</td>
                <td>{{ drink.drink.name }}</td>
                <td>{{ drink.drink.volume }} l</td>
            </tr>
        </tbody>
    </table>
    <p v-if="totalAlcoholMissing > 0" class="fw-bold">
        Du mangler at drikke {{totalAlcoholMissing}} gram alkohol.
    </p>
    <div class="d-flex justify-content-end">
        <button class="btn btn-success" @click="sendToPi">Send til Pi</button>
    </div>
</div>
    `,
    data() {
      return {
        searchPersonID: 1,
        startPromille: 0.0,
        targetPromille: 0.5,
        hours: 6,

        drinks: [], //Holds drinks from database, used in the modal

        AlcoholInTotalGrams: 0,
        standardDrinksPerHour: 0, 
        
        selectedDrinks: [], //selected drinks from the modal
        savedDrinks: [], 
        forventedAlkohol: 0,

        //retreived data about person
        personData: null,
        gender: "male",
        age: 18,
        weight: 70,

        drukplan: [], //drukplan fra distributeAlcohol
        totalAlcoholMissing: 0, // Track how much alcohol is missing from the plan
      };
    },
    methods: {
        calculate() {
            console.log("Start på calc")
            const alcoholDistributionFactor = this.personData.gender === "male" ? 0.7 : 0.6; // Mand: 0.7, Kvinde: 0.6
            const standardDrinkAlcohol = 12; // Alkohol i gram per genstand
            const nedbrydningsHastighed = 0.15;
            // console.log(this.selectedDrinks)
            const requiredAlcohol =
              this.targetPromille * this.personData.weight * alcoholDistributionFactor +
              nedbrydningsHastighed * this.personData.weight * this.hours;
            // this.showAllDrinks();
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
              const response = await axios.get(`https://promillepartnerbackend.azurewebsites.net/api/person/${this.searchPersonID}`);
              this.personData = response.data
              console.log("Person data:", this.personData);
              return this.personData; // Return the fetched data
            } catch (ex) {
              alert(ex.message);
            }
          },
        async getDrinks() {
            try {
              const response = await axios.get(`https://promillepartnerbackend.azurewebsites.net/api/drink`);
              this.drinks = response.data;
            } catch (error)
            {
              console.error("Error fetching drinks:", error);
            }
          },
        saveDrinks() {
            console.log("Selected drinks:", this.selectedDrinks);
            this.savedDrinks = this.selectedDrinks;
            console.log("Saved drinks(fr this time):", this.savedDrinks);
            // Add logic to handle saving the selected drinks
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
    let totalAlcoholScheduled = 0; // Track total alcohol scheduled on the plan

    while (remainingTime > 0) {
      const currentDrink = this.savedDrinks[drinkIndex];
      const interval = drinkIntervals[drinkIndex];
      // calculate alcohol in grams for the current drink(needed for calculating alcoholscheduled)
      const alcoholInGrams = currentDrink.volume * currentDrink.alcoholPercentOfVolume * densityOfAlcohol;

      if (remainingTime < interval) break;

      const formattedTime = this.formatTime(spentTime);

      this.drukplan.push({
        drink: currentDrink,
        pauseTime: formattedTime,
      });

      remainingTime -= interval;
      spentTime += interval;
      totalAlcoholScheduled += alcoholInGrams; // Accumulate the alcohol in grams
      drinkIndex = (drinkIndex + 1) % this.savedDrinks.length;
      console.log("Drukplan:", this.drukplan);
    }
     // Calculate how much alcohol is missing
     this.totalAlcoholMissing =  Math.max(this.AlcoholInTotalGrams - totalAlcoholScheduled).toFixed(2);
      console.log("Total alcohol missing:", this.totalAlcoholMissing);
  },
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  },
  sendToPi() {
    // Add logic to send the drink plan to the Pi
  }
},
    mounted() {
      this.getDrinks(); //Fetches drinks from the API to the modal when the component is mounted
    }
  };
  