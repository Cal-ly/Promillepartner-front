# To-Do List

## Fredag 06.12 (evt. mandag 9.12)
- [X] Mappestruktur
- [X] Refaktorering af components (DrukplanMaker og PromilleCalculator)
- [X] Refaktorering af html/unødig kode
- [X] Fikse problem med modal, når man klikker "Vis person"
- [X] Navbar tekst aligned med brand navn
- [X] Skabt et mere kontinuerligt design ved hjælp af GPT
- [X] Evt. kombinér .css filerne i en fil
- [X] Fix timeToSeconds metode i components\DrukplanMaker\template.js

## Mandag 09.12
- [X] Tilføj Darkmode (Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f)
- [X] Slet de tidligere Darkmode filer
- [X] Tilføj ny darkmode.js fil med ny kode
- [X] Tilføj ny darkmode.css fil med ny kode
- [X] Tilføj Darkmode funktionaliten til alle sider
- [X] index.html
- [X] person.html
- [X] randomcocktail.html

## Tirsdag 10.12
- [ ] Ret navigationsbar
- [ ] Centrér navigationsbar
- [ ] Gør navigationsbar smallere
(
  Lazy-load (https://chatgpt.com/share/6753f5d1-4538-800e-9d73-643eb9371e8b)
  - [ ] Tilføj Lazy-load til komponenterne
  - [ ] Lazy-load på DrukplanMaker
  - [ ] Lazy-load på Person
  - [ ] Lazy-load på RandomCocktail
)

## Onsdag 11.12
- [ ] ... Det der ikke blev nået om tirsdagen 10.12
- [ ] Skrive om design principper i rapporten

## Torsdag 12.12

## Fredag 13.12

## Notes 09.12
Hvis det stadigvæk er aktuelt med at lave siden om til en one-page, så kunne det være en idé at tilføje lazy-load til komponenterne - 
På den måde bliver hjemmesiden ikke langsommere. Dog skal strukturen på siden nok ændres, ellers vil der altid være to af komponenterne,
der altid vil blive "aktiveret".

Det er selvfølgelig noget man kan snakke med PO om, hvis det er noget de virkelig gerne vil have.

## Notes 06.12
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
