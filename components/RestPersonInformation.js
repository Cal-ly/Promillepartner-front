const baseUrl = "https://promillepartnerbackendtest.azurewebsites.net/api/person";

export default {
  template: `
    <div id="upload">
      <h2>Vis person</h2>
      <label for="id">Id:</label>
      <input type="number" id="id" v-model.number="id" required />
      <button @click="showPersonById">Vis person</button>
      Id:{{shownPerson.id}} Age:{{shownPerson.age}} Weight:{{shownPerson.weight}}

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

      <p>{{creationMessage}}</p>
      <p>{{addMessage}}</p>
     
      <ul id="results">
        <li v-for="person in shownRecords">Age:{{person.age}} ID:{{person.id}} Record:{{person.weight}}</li>
    </ul>
    </div>  
  `,
  data() {
    return {
      shownRecords: [],
      shownPerson: [],
      enteredGender: "man",
      enteredWeight: 0,
      enteredAge: 0,
      id: 0,
      addData: {
          man: true,
          weight: 0,
          age: 0
      },
      searchId: 0,
      creationMessage: "",
      addMessage: ""
    };
  },
  methods: {
    async showPersonById() {
      try {
          const response = await axios.get(`${baseUrl}/${this.id}`)
          this.shownRecords = []
          this.shownPerson = await response.data;
          console.log(this.shownRecords)
      } catch (ex) {
          alert(ex.message) 
      }
  },
  async showAllPersons() {
      try {
          const response = await axios.get(`${baseUrl}`)
          this.shownRecords = []
          this.shownRecords = await response.data;
          console.log(this.shownRecords)
      } catch (ex) {
          alert(ex.message) 
      }
  },
  async addPerson(){
      if(this.enteredGender == "man") {
        this.addData.gender = true;
      } else {
        this.addData.gender = false;
      }
      this.addData.weight = this.enteredWeight;
      this.addData.age = this.enteredAge;
      
      try {
          responseFromAPI = await axios.post("https://promillepartnerbackendtest.azurewebsites.net/api/person", json=this.addData)
          this.addMessage = "response " + responseFromAPI.status + " " + responseFromAPI.statusText
          this.creationMessage = responseFromAPI.text
      } catch (ex) {
          alert(ex)
      } finally {
          const responseData = await responseFromAPI.data;
          console.log(responseData)
          this.creationMessage = `Dine oplysninger er gemt dit id er ${responseData.id}`
          const values = await responseFromAPI.data;
          this.enteredGender = values.gender;
          this.enteredAge = values.age;
          this.enteredWeight = values.weight;
          this.id = values.id;
      }
    },
  },
};
