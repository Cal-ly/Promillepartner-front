const baseUrl = "https://promillepartnerbackendtest.azurewebsites.net/api/person";

const app = Vue.createApp({
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
        }
    },
    methods: {
        async showPersonById() {

            //this.shownRecords = JSON.destringify(await axios.get(baseUrl).data);
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

            //this.shownRecords = JSON.destringify(await axios.get(baseUrl).data);
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
                response = await axios.post("https://promillepartnerbackendtest.azurewebsites.net/api/person", json=this.addData)
                this.addMessage = "response " + response.status + " " + response.statusText
                this.creationMessage = response.text
            } catch (ex) {

                alert(ex)

            } finally {
                const responseData = await response.data;
                console.log(responseData)
                this.creationMessage = `Dine oplysninger er gemt dit id er ${responseData.id}`
                const values = await response.data;
                this.enteredGender = values.gender;
                this.enteredAge = values.age;
                this.enteredWeight = values.weight;
                this.id = values.id;
            }
        }
    }
}).mount("#upload")