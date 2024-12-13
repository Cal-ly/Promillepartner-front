export const methods = {
    async getLatestPiReading(){
        try {
            const response = await axios.get(
              `https://promillepartnerbackend.azurewebsites.net/api/piReading`
            );
            this.allPromilleReadings = response.data;
            
            this.latestPromilleReading = this.allPromilleReadings[this.allPromilleReadings.length - 1]
            
            this.latestPromilleReadingpromille = (this.latestPromilleReading.promille / 1000).toFixed(2)

            console.log("Sidste Promille data:", this.latestPromilleReading);

            this.formattedDate()
          } catch (ex) {
      
            alert(ex.message);
          }
    },
    formattedDate() {
      const date = new Date(this.latestPromilleReading.timeStampMiliseconds); // Convert to milliseconds
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();

      this.normalTimestamp = `${hours}:${minutes}, ${day}-${month}-${year}`;
      console.log(this.normalTimestamp)
    }
} 
