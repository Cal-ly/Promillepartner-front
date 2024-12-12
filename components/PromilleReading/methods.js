export const methods = {
    async getLatestPiReading(){
        try {
            const response = await axios.get(
              `https://promillepartnerbackend.azurewebsites.net/api/piReading`
            );
            this.allPromilleReadings = response.data;
            
            this.latestPromilleReading = this.allPromilleReadings[this.allPromilleReadings.length - 1]
            
            console.log("Sidste Promille data:", this.latestPromilleReading);
          } catch (ex) {
      
            alert(ex.message);
          }
    }
} 
