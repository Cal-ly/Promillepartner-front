import axios from "axios";

const baseUrl = "https://promillepartnerbackendtest.azurewebsites.net/api/person";

export default {
  template: `
    <div id="person">
      <h2>Vis person</h2>
      <label for="id">Id:</label>
      <input type="number" id="id" v-model.number="id" required />
      <button @click="showPersonById">Vis person</button>
      Id: {{ shownPerson.id }} Age: {{ shownPerson.age }} Weight: {{ shownPerson.weight }}

      <h2>Indtast oplysninger</h2>

      <label for="gender">Køn:</label>
      <select id="gender" v-model="enteredGender">
        <option value="male">Mand</option>
        <option value="female">Kvinde</option>
      </select>

      <label for="weight">Vægt (kg):</label>
      <input type="number" id="weight" v-model.number="enteredWeight" required />

      <label for="age">Alder:</label>
      <input type="number" id="age" v-model.number="enteredAge" required />

      <button @click="addPerson">Gem mine oplysninger</button>

      <p>{{ creationMessage }}</p>
      <p>{{ addMessage }}</p>

      <button @click="showAllPersons">Vis alle personer</button>
      <ul id="results">
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
