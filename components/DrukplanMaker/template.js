export default `
  <div class="drukplanMaker">
    <!-- Header Section -->
    <div class="container mt-4 text-center">
      <h1 class="mb-3">Din Drukplan</h1>
      <p>Vælg dine personlige oplysninger og få din helt egen personlige drukplan genereret til dig!</p>
    </div>

    <!-- Custom Settings Section -->
    <div class="container mt-4">
      <div class="custom-settings p-4 border rounded shadow">
        <div class="mb-3">
          <label id="getPersonalInformationInputLabel" for="getPersonalInformationInput" class="form-label">
            Id for dine personlige informationer:
          </label>
          <input
            type="number"
            id="search-person-id"
            class="form-control"
            v-model="searchPersonID"
            placeholder="Indtast ID på gemte person"
          />
          <button
            class="btn btn-primary mt-2"
            v-on:click="fetchPersonAndShowModal"
          >
            Vis person
          </button>
        </div>
        <div class="mb-3">
          <label for="current-promille" class="form-label">Nuværende promille:</label>
          <input type="number" id="current-promille" v-model.number="startPromille" class="form-control" value="0">
        </div>
        <div class="mb-3">
          <label id="targetPromilleInputLabel" class="form-label" for="targetPromilleInput">Ønsket promille:</label>
          <input id="targetPromilleInput" type="number" v-model.number="targetPromille" step="0.01" required value="0" class="form-control" />
        </div>
        <div class="mb-3">
          <label id="hoursInputLabel" class="form-label" for="hoursInput">Længde af drukplan:</label>
          <input id="hoursInput" type="number" class="form-control" v-model.number="hours" required placeholder="I timer"/>
        </div>
        <div class="mb-3">
          <label for="drinks" class="form-label">Vælg drinks fra listen:</label>
          <input type="text" class="form-control mb-2" placeholder="Vis listen" data-bs-toggle="modal" data-bs-target="#drinksModal"/>
          <div class="d-flex gap-2">
            <button class="btn btn-primary" @click="saveSettings">Udregn promille</button>
            <button class="btn btn-secondary" @click="createDrinkPlan">Generer Drukplan</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Person Info Modal -->
    <div
      class="modal fade"
      id="personInfoModal"
      tabindex="-1"
      aria-labelledby="personInfoModalLabel"
      aria-hidden="true"
      v-show="personData"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="personInfoModalLabel">
              Id {{ personData.id }}'s Information
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Køn:</strong> {{ personData.man ? "Mand" : "Kvinde" }}</p>
            <p><strong>Vægt:</strong> {{ personData.weight }} kg</p>
            <p><strong>Alder:</strong> {{ personData.age }} år</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Luk
            </button>
          </div>
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
    <div class="container mt-4 text-center">
      <p class="fw-bold">
        Du skal drikke {{standardDrinksPerHour}} genstande i timen, som svarer til {{AlcoholInTotalGrams}} gram alkohol i alt.
      </p>
      <p class="fw-bold">
        Din promille vil være {{targetPromille}} om {{hours}} timer!
      </p>
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
      <p v-if="totalAlcoholMissing > 0" class="fw-bold text-danger">
        Du mangler at drikke {{totalAlcoholMissing}} gram alkohol.
      </p>
      
      <!-- Send To Pi Modal -->
      <div class="modal fade" id="sendToPiModal" tabindex="-1" aria-labelledby="sendToPiModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="sendToPiModalLabel">Input Pi Identifier</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <label for="PiIdentifier" class="form-label">Enter Pi Name</label>
              <input
                type="text"
                id="PiIdentifier"
                class="form-control"
                v-model="PiIdentifier"
                placeholder="MyAwesomePi123..."
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="sendToPi" data-bs-dismiss="modal">Submit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Button to trigger modal -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sendToPiModal">Send To Pi</button>
    </div>
  </div>
`;