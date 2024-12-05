export const template = `
  <div id="person">
    <h2 id="headerPersonInformation">Vis person</h2>
    <label id="idInputLabel" for="idInput">Id:</label>
    <input type="number" id="idInput" v-model.number="id" required />
    <button id="buttonShowPerson" @click="showPersonById">Vis person</button>
    <p id="personInformation">Id: {{ shownPerson.id }} Age: {{ shownPerson.age }} Weight: {{ shownPerson.weight }}</p>

    <h2 id="headerEnterInformation">Indtast oplysninger</h2>
    <label id="genderInputLabel" for="genderInput">Køn:</label>
    <select id="genderInput" v-model="enteredGender">
      <option id="optionMale" value="male">Mand</option>
      <option id="optionFemale" value="female">Kvinde</option>
    </select>

    <label id="weightInputLabel" for="weightInput">Vægt (kg):</label>
    <input type="number" id="weightInput" v-model.number="enteredWeight" required />

    <label id="ageInputLabel" for="age">Alder:</label>
    <input type="number" id="ageInput" v-model.number="enteredAge" required />

    <button id="buttonSaveInformation" @click="addPerson">Gem mine oplysninger</button>

    <p id="creationMessage">{{ creationMessage }}</p>
    <p id="addMessage">{{ addMessage }}</p>

    <button id="buttonShowAllPersons" @click="showAllPersons">Vis alle personer</button>
    <ul id="personResults">
      <li v-for="person in shownRecords" :key="person.id">ID: {{ person.id }} Age: {{ person.age }}  Weight : {{ person.weight }}</li>
    </ul>
  </div>
`;
