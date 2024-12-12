export const template = 
`
<p id="display_latest_promillemeasurement" v-if="latestPromilleReading !== null">Promille:{{ latestPromilleReadingpromille}}, Målingstid:{{normalTimestamp}}</p>
<button @click="getLatestPiReading">Hent seneste måling</button>
`