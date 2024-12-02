const baseUrl = "https://promillepartnerbackend.azurewebsites.net/api/person";

export default {
  template: `
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
        <li v-for="person in shownRecords">ID: {{ person.id }} Age: {{ person.age }}  Weight : {{ person.weight }}</li>
      </ul>
    </div>  
  `,
  data() {
    return {
      shownRecords: [],
      shownPerson: {},
      enteredGender: "male",
      enteredWeight: 0,
      enteredAge: 0,
      id: 0,
      addData: {
        gender: true,
        weight: 0,
        age: 0
      },
      creationMessage: "",
      addMessage: ""
    };
  },
  methods: {
    async showPersonById() {
      try {
        const response = await axios.get(`${baseUrl}/${this.id}`);
        this.shownPerson = response.data;
        return this.shownPerson; // Return the fetched data
      } catch (ex) {
        alert(ex.message);
      }
    },
    async showAllPersons() {
      try {
        const response = await axios.get(baseUrl);
        this.shownRecords = response.data;
        return this.shownRecords; // Return the fetched data
      } catch (ex) {
        alert(ex.message);
      }
    },
    async addPerson() {
      this.addData.gender = this.enteredGender === "male";
      this.addData.weight = this.enteredWeight;
      this.addData.age = this.enteredAge;

      try {
        const response = await axios.post(baseUrl, this.addData);
        this.addMessage = `Response: ${response.status} ${response.statusText}`;
        const responseData = response.data;
        this.creationMessage = `Dine oplysninger er gemt dit id er ${responseData.id}`;
        this.enteredGender = responseData.gender ? "male" : "female";
        this.enteredAge = responseData.age;
        this.enteredWeight = responseData.weight;
        this.id = responseData.id;
      } catch (ex) {
        alert(ex.message);
      }
    }
  }
};
