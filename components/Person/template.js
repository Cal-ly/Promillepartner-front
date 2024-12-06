export const template = `
  <div id="person" class="container my-4">
    <h2 id="headerPersonInformation" class="mb-4 text-center">Vis person</h2>
    <div class="mb-3">
      <label id="idInputLabel" for="idInput" class="form-label">Id:</label>
      <input type="number" id="idInput" v-model.number="id" class="form-control" placeholder="Indtast ID" required />
    </div>
    <div class="d-grid gap-2">
      <button id="buttonShowPerson" @click="showPersonById" class="btn btn-primary">Vis person</button>
    </div>
    <p id="personInformation" class="mt-3 text-muted">
      Id: {{ shownPerson.id }} | Alder: {{ shownPerson.age }} | Vægt: {{ shownPerson.weight }}
    </p>

    <h2 id="headerEnterInformation" class="mt-5 mb-4 text-center">Indtast oplysninger</h2>
    <div class="mb-3">
      <label id="genderInputLabel" for="genderInput" class="form-label">Køn:</label>
      <select id="genderInput" v-model="enteredGender" class="form-select">
        <option id="optionMale" value="male">Mand</option>
        <option id="optionFemale" value="female">Kvinde</option>
      </select>
    </div>
    <div class="mb-3">
      <label id="weightInputLabel" for="weightInput" class="form-label">Vægt (kg):</label>
      <input type="number" id="weightInput" v-model.number="enteredWeight" class="form-control" placeholder="Indtast vægt" required />
    </div>
    <div class="mb-3">
      <label id="ageInputLabel" for="age" class="form-label">Alder:</label>
      <input type="number" id="ageInput" v-model.number="enteredAge" class="form-control" placeholder="Indtast alder" required />
    </div>
    <div class="d-grid gap-2">
      <button id="buttonSaveInformation" @click="addPerson" class="btn btn-success">Gem mine oplysninger</button>
    </div>

    <p id="creationMessage" class="mt-3 text-success">{{ creationMessage }}</p>
    <p id="addMessage" class="mt-1 text-danger">{{ addMessage }}</p>

    <div class="mt-5 text-center">
      <button id="buttonShowAllPersons" @click="showAllPersons" class="btn btn-secondary">Vis alle personer</button>
    </div>
    <ul id="personResults" class="list-group mt-4">
      <li v-for="person in shownRecords" :key="person.id" class="list-group-item">
        <strong>ID:</strong> {{ person.id }} | <strong>Alder:</strong> {{ person.age }} | <strong>Vægt:</strong> {{ person.weight }}
      </li>
    </ul>
  </div>
`;