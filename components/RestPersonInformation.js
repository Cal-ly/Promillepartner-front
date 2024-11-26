export default {
  template: `
    <div class="rest-person-communication">
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

      <button @click="addRecord">Gem mine oplysninger</button>

    </div>
  `,
  data() {
    return {
      enteredGender: "man",
      enteredWeight: 0,
      enteredAge: 0,
      addData: {
        man: true,
        weight: 0,
        age: 0
      },
      searchId: 0
    };
  },
  computed: {
    async addRecord(){
      if(this.enteredGender == "man") {
        this.addData.gender = true;
      } else {
        this.addData.gender = false;
      }
      this.addData.weight = this.enteredWeight;
      this.addData.age = this.enteredAge;
      try {
          response = await axios.post("https://localhost:7175/api/person", this.addData)
          //this.addMessage = "response " + response.status + " " + response.statusText
      } catch (ex) {
          alert(ex)
      }
    },
  },
};
