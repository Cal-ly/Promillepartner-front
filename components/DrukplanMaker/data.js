export default function () {
    return {
      errorMessage: null,
      searchPersonID: 2,
      startPromille: 0.0,
      targetPromille: 0.5,
      hours: 6,
    
      drinks: [], // Holds drinks from database, used in the modal
      AlcoholInTotalGrams: 0,
      standardDrinksPerHour: 0, 
    
      selectedDrinks: [], // selected drinks from the modal
      savedDrinks: [], 
      forventedAlkohol: 0,
    
      // Retrieved data about person
      personData: {},
      gender: "male",
      age: 18,
      weight: 10,
    
      drukplan: [], // Drink plan from distributeAlcohol
      totalAlcoholMissing: 0, // Track how much alcohol is missing from the plan
      totalAlcoholScheduled: 0, // Track how much alcohol is scheduled in the plan

      dataToSendToPi: [], // this is the data that gets sent to pi, based on drukplan, but filtered // currently a list of time differences between drinks
      PiIdentifier: null, // this is the identifier used to connect to the right pi
      showInput: false,
      responseMessage: null,
      timeStart: null,
    };
  }  