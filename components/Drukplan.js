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
                <button class="btn btn-primary save-button" @click="calculate" >Gem
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
              class="btn btn-danger"
              @click="saveDrinks"
              data-bs-dismiss="modal"
            >
              ✕ Close
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="saveDrinks"
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
                    Du skal drikke {{standardDrinksPerHour}} genstande i timen, som svarer til {{standardDrinksInTotal}} genstande i alt over {{hours}} timer!
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
                <td>{{ drink.pauseTilNæsteDrink }}</td>
                <td>{{ drink.drink.name }}</td>
                <td>{{ drink.drink.volume }} ml</td>
            </tr>
        </tbody>
    </table>
    <div class="d-flex justify-content-end">
        <button class="btn btn-success" @click="startSession">Start session</button>
    </div>
</div>
    `,
    data() {
      return {
        searchPersonID: 0,
        startPromille: 0.0,
        targetPromille: 0.5,
        hours: 1,

        drinks: [], //Holds drinks from database, used in the modal

        standardDrinksInTotal: 0,
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
      };
    },
    methods: {
        calculate() {
            this.saveDrinks = this.selectedDrinks;
            console.log("virker")
            const alcoholDistributionFactor = this.gender === "male" ? 0.7 : 0.6; // Mand: 0.7, Kvinde: 0.6
            const standardDrinkAlcohol = 12; // Alkohol i gram per genstand
            const nedbrydningsHastighed = 0.15;
            // console.log(this.selectedDrinks)
            const requiredAlcohol =
              this.targetPromille * this.weight * alcoholDistributionFactor +
              nedbrydningsHastighed * this.weight * this.hours;
            // this.showAllDrinks();
            this.standardDrinksInTotal = requiredAlcohol;
            this.standardDrinksPerHour = requiredAlcohol / (standardDrinkAlcohol * this.hours);
            return standardDrinksPerHour, this.standardDrinksInTotal;
            
          },

        async getPersonByID() {
            try {
              const response = await axios.get(`https://promillepartnerbackend.azurewebsites.net/api/person/${this.searchPersonID}`);
              this.personData = response.data
              console.log(this.personData)
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
            // Add logic to handle saving the selected drinks
          },

  //     DistributeAlcohol() {
  //     // Retrieve drinks from the database
  //     let actualDrinks = this.drinks.filter(d => this.saveDrinks.includes(d.name));
  
  //     console.log("Drinks from db: ", actualDrinks);
  
  //     if (actualDrinks.length === 0 || this.hours <= 0) {
  //         console.error("No drinks to distribute or invalid duration.");
  //         return;
  //     }
  
  //     const densityOfAlcohol = 7.89;
  //     const drinkIntervals = []; // Time intervals for each drink in minutes
  
  //     // Calculate drinking intervals for each selected drink
  //     for (let drink of actualDrinks) {
  //         const interval = ((drink.volume * drink.alcoholPercentOfVolume * densityOfAlcohol) / this.standardDrinksInTotal) * this.hours * 60;
  //         drinkIntervals.push(interval);
  //     }
  
  //     let positionInActualDrinks = 0;
  //     this.drukplan = [];
  //     let restTime = this.hours * 60;
  //     let spentTime = 0;
  
  //     while (restTime > 0) {
  //         const currentDrink = actualDrinks[positionInActualDrinks];
  //         const interval = drinkIntervals[positionInActualDrinks];
  
  //         if (restTime < interval) break; // Stop if remaining time is less than the current interval
  
  //         // Calculate next pause time
  //         var d = new Date();
  //         //d.setHours(1, spentTime, 0, 0); // Start at midnight and add spent time
  //         d.setUTCHours(0,spentTime,0,0)

  //         //if (d.getHours() == 23){
  //         //  console.log("It Worked! The time has been changed")
  //         //  d.setHours(10,spentTime,0,0)
  //         //}

  //         // Format time as HH:MM:SS
  //         const formattedTime = d.toISOString().substr(11, 8);

  //         restTime -= interval;
  //         spentTime += interval;
  
  //         this.drukplan.push({
  //             drink: currentDrink,
  //             pauseTilNæsteDrink: formattedTime
  //         });
  
  //         // Move to the next drink
  //         positionInActualDrinks = (positionInActualDrinks + 1) % actualDrinks.length;
  //     }
  
  //     console.log("Drinking Plan:", this.drukplan);
  // },
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
      this.getDrinks(); //Fetches drinks from the API to the modal when the component is mounted
    }
  };
  