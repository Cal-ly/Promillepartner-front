export default `
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
        <input type="number" id="search-person-id" class="form-control" v-model="searchPersonID" placeholder="Indtast ID på gemte person">
        <button class="btn btn-primary save-button" v-on:click="getPersonByID">Hent oplysninger</button>       
      </div>
      <div>
        <label for="current-promille" class="form-label mt-3">Nuværende promille:</label>
        <input type="number" id="current-promille" v-model.number="startPromille" class="form-control" value="0">
      </div>
      <div>
        <label id="targetPromilleInputLabel" class="form-label mt-3" for="targetPromilleInput">Ønsket promille:</label>
        <input id="targetPromilleInput" type="number" v-model.number="targetPromille" step="0.01" required value="0" class="form-control" />
      </div>
      <div>
        <label id="hoursInputLabel" class="form-label mt-3" for="hoursInput">Længde af drukplan:</label>
        <input id="hoursInput" type="number" class="form-control" v-model.number="hours" required placeholder="I timer"/>
      </div>
      <div>
        <label for="drinks" class="form-label mt-3">Vælg drinks fra listen:</label>
        <input type="text" class="form-control mb-3" placeholder="Vis listen" readonly data-bs-toggle="modal" data-bs-target="#drinksModal"/>
        <button class="btn btn-primary save-button" @click="saveSettings" >Gem</button>
        <button class="btn btn-primary save-button" @click="createDrinkPlan" >Druk</button>
      </div>
    </div>
  </div>

  <!-- Drinks Modal -->
  <div class="modal fade" id="drinksModal" tabindex="-1" aria-labelledby="drinksModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="drinksModalLabel">Vælg dine drinks</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-check" v-for="drink in drinks" :key="drink.id">
            <input class="form-check-input" type="checkbox" :id="'drink-' + drink.id" v-model="selectedDrinks" :value="drink"/>
            <label class="form-check-label" :for="'drink-' + drink.id">{{ drink.name }}</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="saveDrinks" data-bs-dismiss="modal">✓ Save</button>
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
      </p>
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
</div>
`;
