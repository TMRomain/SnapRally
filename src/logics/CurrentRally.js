import React,{useState} from 'react';
import { getImage } from "../api/EtapeApi";

export default class CurrentRally{
    constructor() {
        this.state = {
            isRallyActive : false,
            etapeActuel: 0,
            rallyActuel:null,
            image: {
                urlImageEtape:null,
                imageRallyLink: null,
                etape : null,
            }
        };
    }
    updateRally(rally){
        this.state.etapeActuel = 0;
        if(this.state.rallyActuel ==null || (this.state.rallyActuel != null && this.state.rallyActuel.linkRally != rally.linkRally)){
            this.state.rallyActuel = rally;
            this.state.image.urlImageEtape = null;
            this.getUrlImage(0);
        } 
    }
    updateEtape(numEtape){
        this.getUrlImage(numEtape);
    }
    lancerLeRally() {
        console.log("Debut Rally");
        this.state.isRallyActive =true;
        this.state.etapeActuel =0;
    }
    quitterLeRally() {
        console.log("Fin Rally");
        this.state.etapeActuel =0;
        this.state.isRallyActive = false;
        console.log(this.state.isRallyActive);
    }
    isRallyOver() {
        if(this.state.rallyActuel!= null&&this.state.etapeActuel >= this.state.rallyActuel.lesEtapes.length){
            return true;
        }
        else{
            return false;
        }
    }

    isRallyInProgress(){
        return(this.state.isRallyActive);
        //return false;
    }
    getCurrentRally() {
        return(this.state.rallyActuel);
    }

    getCurrentEtape() {
        return(this.state.rallyActuel.lesEtapes[this.state.etapeActuel ]);
    }

    getCurrentEtapeCoord() {
        return(this.state.rallyActuel.lesEtapes[this.state.etapeActuel]);
    }

    async getUrlImage(numEtape){
    
        if(this.state.image.etape == numEtape && this.state.rallyActuel != null && this.state.rallyActuel.linkRally == this.state.image.imageRallyLink &&this.state.image.urlImageEtape!=null){
            return(this.state.image.urlImageEtape);
        }
        await getImage(this.state.rallyActuel.lesEtapes[numEtape].nomImage).then((urlImage) => {
            if (urlImage != undefined && urlImage != null) {
                this.state.image.urlImageEtape = urlImage;
                this.state.image.imageRallyLink = this.state.rallyActuel.linkRally;
                this.state.image.etape = numEtape;
            }
        });
        return(this.state.image.urlImageEtape);
      }

}