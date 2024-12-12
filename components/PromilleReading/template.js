export const template = 
`
<button @click="getLatestPiReading">hent</button>
<p id="display_latest_promillemeasurement" v-if="latestPromilleReading !== null">Promille:{{ latestPromilleReading.promille}}, time:{{latestPromilleReading.timeStampMiliseconds}}</p>
`