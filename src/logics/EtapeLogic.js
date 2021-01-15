export default class EtapeLogic{

    constructor() {
        this.comparationTresholdPos = 0.00001;
        this.comparationTresholdGlobal = 10;
        this.comparationTresholdDeg = 15;
      }

    compareEtape(firstEtape,SecondEtape){
        if(!this.isInRange(firstEtape.longitudeEtape,SecondEtape.longitudeEtape,this.comparationTresholdPos)){
            console.log("Mauvaise Longitude");            
            console.log(firstEtape.longitudeEtape);
            console.log(SecondEtape.longitudeEtape);
            return false;
        }
        if(!this.isInRange(firstEtape.latitudeEtape,SecondEtape.latitudeEtape,this.comparationTresholdPos)){
            console.log("Mauvaise Latitude");
            console.log(firstEtape.latitudeEtape);
            console.log(SecondEtape.latitudeEtape);

            return false; 
        }
        if(!this.isInRange(firstEtape.angleXEtape,SecondEtape.angleXEtape,this.comparationTresholdGlobal)){
            console.log("Mauvaise AngleX");
            return false; 
        }
        // if(!this.isInRange(firstEtape.angleYEtape,SecondEtape.angleYEtape,this.comparationTresholdGlobal)){
        //     console.log("Mauvaise AngleY");
        //     return false; 
        // }
        if(!this.isInRange(firstEtape.angleZEtape,SecondEtape.angleZEtape,this.comparationTresholdGlobal)){
            console.log("Mauvaise AngleZ");
            console.log(firstEtape.angleZEtape);
            console.log(SecondEtape.angleZEtape);
            return false; 
        }
        if(!this.isInRange(firstEtape.degreeEtape,SecondEtape.degreeEtape,this.comparationTresholdDeg)){
            console.log("Mauvaise Degree");
            console.log(firstEtape.degreeEtape);
            console.log(SecondEtape.degreeEtape);
            return false; 
        }
        return true; 
    };

    isInRange(value,comparateValue,addedComparationValue){
        comparateValue = comparateValue.toFixed(5);
        value = value.toFixed(5);
        if(value == comparateValue || value <= Number(comparateValue) + Number(addedComparationValue) && value >= Number(comparateValue) - Number(addedComparationValue)){
            return(true);
        }else{
            return(false);
        }
    }
}