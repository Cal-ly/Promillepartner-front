export const template = `
<div>
 <h2 id="headerPersonInformation" class="mb-4 text-center">Vis person</h2>
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
</div>

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