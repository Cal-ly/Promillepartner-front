export const template = `
  <div class="drukplanMaker">
    <!-- Header Section -->
    <div class="container mt-4">
      <h1>Din Drukplan</h1>
      <p>Vælg dine personlige oplysning og få din helt egen personlige drukplan generet til dig!</p>
    </div>
    
    <!-- Custom Settings -->
    <div class="container mt-4">
      <div class="custom-settings">
        <div>
          <label for="getPersonalInformationInput">Hent personinformationer</label>
          <input type="number" id="search-person-id" class="form-control" v-model="searchPersonID" placeholder="Indtast ID på gemte person">
          <button class="btn btn-primary save-button" @click="getPersonByID">Hent oplysninger</button>
        </div>
        <div>
          <label for="current-promille" class="form-label mt-3">Nuværende promille:</label>
          <input type="number" id="current-promille" v-model.number="startPromille" class="form-control">
        </div>
        <div>
          <label for="targetPromilleInput" class="form-label mt-3">Ønsket promille:</label>
          <input type="number" id="targetPromilleInput" v-model.number="targetPromille" class="form-control">
        </div>
        <div>
          <label for="hoursInput" class="form-label mt-3">Længde af drukplan:</label>
          <input type="number" id="hoursInput" v-model.number="hours" class="form-control">
        </div>
      </div>
    </div>
    
    <!-- Add more sections as needed -->
  </div>
`;