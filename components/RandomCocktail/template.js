export const template = `
  <div class="random-cocktail container my-4">
    <h2 id="RandomCocktailHeader" class="text-center mb-4">Tilfældig Cocktail</h2>
    <div class="d-grid gap-2">
      <button id="buttonGetRandomDrink" @click="fetchRandomCocktail" class="btn btn-primary">Hent en tilfældig cocktail</button>
    </div>
    <div id="divFoundDrink" v-if="cocktail" class="cocktail-details mt-4 p-4 border rounded shadow">
      <h3 id="headerFoundDrink" class="text-center mb-3">{{ cocktail.strDrink }}</h3>
      <div class="text-center mb-4">
        <img 
          id="imageFoundDrink" 
          :src="cocktail.strDrinkThumb" 
          :alt="cocktail.strDrink" 
          class="img-fluid rounded" 
          style="max-width: 150px; height: auto;" 
        />
      </div>
      <p id="drinkCategory" class="mb-1"><strong>Kategori:</strong> {{ cocktail.strCategory }}</p>
      <p id="containAlcohol" class="mb-1"><strong>Type:</strong> {{ cocktail.strAlcoholic }}</p>
      <p id="servingGlass" class="mb-4"><strong>Glas:</strong> {{ cocktail.strGlass }}</p>
      
      <h4 id="headerIngredients" class="mb-3">Ingredienser:</h4>
      <ul id="unorderedIngredientList" class="list-group mb-4">
        <li 
          v-for="(ingredient, index) in ingredients" 
          :key="index" 
          class="list-group-item">
          {{ ingredient }}
        </li>
      </ul>
      
      <h4 id="instructionList" class="mb-3">Instruktioner:</h4>
      <p class="text-muted">{{ cocktail.strInstructions }}</p>
    </div>
  </div>
`;