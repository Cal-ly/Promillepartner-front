# To-Do List (Alexander)

## Fredag 05.12 (evt. mandag 9.12)
- [X] Mappestruktur
- [X] Evt. kombinér .css filerne i en fil
- [X] Refaktorering af components (DrukplanMaker og PromilleCalculator)
- [X] Refaktorering af html/unødig kode
- [X] Fikse problem med modal, når man klikker "Vis person"
- [ ] 

## Mandag 09.12
- [ ] Tilføj Darkmode (Reference: https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp)
    -- [ ] Slet de tidligere Darkmode filer
    -- [ ] Tilføj ny darkmode.js fil med ny kode
    -- [ ] Tilføj ny darkmode.css fil med ny kode

## Tirsdag 10.12

## Onsdag 11.12
- [ ] Evt. styling af siden

## Torsdag 12.12
- [ ] Evt. fortsæt styling af siden

## Notes
- PromilleCalculator kunne slettes uden problemer. Promille Beregner siden er blevet slettet, da den ikke længere bruges.
- "Vis person" knappens problematik er var denne kode:
```html
<div
  class="modal fade"
  id="personInfoModal"
  tabindex="-1"
  aria-labelledby="personInfoModalLabel"
  aria-hidden="true"
  v-if="personData"
>
```
og i data.js filen
```javascript
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
      personData: null,
      gender: "male",
      age: 18,
      weight: 70,
    
      drukplan: [], // Drink plan from distributeAlcohol
      totalAlcoholMissing: 0, // Track how much alcohol is missing from the plan
    };
  }  
```

I den nye kode bliver
```js
v-if="personData" --> v-show="personData"
```
```js
personData: null, --> personData: {},
```
