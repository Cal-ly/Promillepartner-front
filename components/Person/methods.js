const baseUrl = "https://promillepartnerbackend.azurewebsites.net/api/person";

export const methods = {
  async showPersonById() {
    try {
      const response = await axios.get(`${baseUrl}/${this.id}`);
      this.shownPerson = response.data;
      return this.shownPerson;
    } catch (ex) {
      alert(ex.message);
    }
  },
  async showAllPersons() {
    try {
      const response = await axios.get(baseUrl);
      this.shownRecords = response.data;
      return this.shownRecords;
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
};
