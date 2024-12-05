export const template = `
  <div class="calculator">
    <h2 id="PromilleBeregnerHeader">Promille Beregner</h2>
    <form id="PromilleBeregnerForm" @submit.prevent="calculate">
      <label id="genderLabel" for="gender">Køn:</label>
      <select id="genderSelect" v-model="gender">
        <option id="genderSelectMale" value="male">Mand</option>
        <option id="genderSelectFemale" value="female">Kvinde</option>
      </select>

      <label id="ageInputLabel" for="ageInput">Alder:</label>
      <input id="ageInput" type="number" v-model.number="age" required />

      <label id="weightInputLabel" for="weightInput">Vægt (kg):</label>
      <input id="weightInput" type="number" v-model.number="weight" required />

      <label id="targetPromilleInputLabel" for="targetPromilleInput">Slutpromille:</label>
      <input id="targetPromilleInput" type="number" v-model.number="targetPromille" step="0.01" required />

      <label id="hoursInputLabel" for="hoursInput">Antal timer:</label>
      <input id="hoursInput" type="number" v-model.number="hours" required />

      <button id="buttonBeregn" type="submit">Beregn</button>
    </form>

    <div id="promilleResultDivision" v-if="result !== null" class="result">
      <h3 id="resultHeader">Resultat</h3>
      <p id="resultText">
        Du skal drikke ca. <strong>{{ result }}</strong> genstand(e) i timen
        for at nå din ønskede promille.
        Forventet alkohol drukket: {{ totalAlcohol }} gram.
      </p>

      <select id="dropDownSelectDrinks" v-model="selectedDrinks" multiple>
        <option v-for="item in retrievedDrinks" :key="item.id">{{ item.name }}</option>
      </select>
      <button id="buttonGenererDrukplan" @click="generateDrinkPlan">Generer drukplan</button>

      <div>
        <table id="tableDrukplan" class="table">
          <thead id="tableHeaderDrukplan" class="thead-dark">
            <tr>
              <th>Tid</th>
              <th>Drink</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="drink in drukplan" :key="drink.drink.id">
              <td>{{ drink.pauseTime }}</td>
              <td>{{ drink.drink.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;
