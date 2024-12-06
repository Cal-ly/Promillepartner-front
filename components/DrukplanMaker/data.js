export default function () {
    return {
      searchPersonID: 1,
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
      weight: 70,
    
      drukplan: [], // Drink plan from distributeAlcohol
      totalAlcoholMissing: 0, // Track how much alcohol is missing from the plan
    };
  }  