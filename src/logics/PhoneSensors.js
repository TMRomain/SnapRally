import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  TextInput,
  View
} from 'react-native';

//Utiliser pour recuperer les information sur la position
import Geolocation from '@react-native-community/geolocation';

//Utiliser pour recuperer les information sur la angle par raport a une carte
import RNSimpleCompass from 'react-native-simple-compass';

//Utiliser pour recuperer differente valeur des capteurs du telephone 
import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
  } from "react-native-sensors";


setUpdateIntervalForType(SensorTypes.accelerometer, 400);


 export default class Sensors{
    constructor() {
        this.position = {
          latitude: 10,
          longitude: 10,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }
        this.Degree = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }
    getCurrentPosition() {
        Geolocation.getCurrentPosition((pos) => {
            const crd = pos.coords;
            this.position.latitude = crd.latitude;
            this.position.longitude = crd.longitude;
            this.position.latitudeDelta = 0.0421;
            this.position.longitudeDelta = 0.0421;
          });
    }

    getCompass(){
        // defaults to 100ms
        const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
        RNSimpleCompass.start(degree_update_rate, (degree) => {
            this.Degree = degree;
            RNSimpleCompass.stop();
        });
    }
    
    getRawValue(){
        const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
        { this.x = x, this.y = y, this.z = z },
      );
    }

    getAngle() {
        this.getRawValue();
        var normOfG = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        var normX = this.x / normOfG;
        var normY = this.y / normOfG;
        var normZ = this.z / normOfG;
    
        this.AngleX = Math.round(Math.acos(normX) * 180 / Math.PI);
        this.AngleY = Math.round(Math.acos(normY) * 180 / Math.PI);
        this.AngleZ = Math.round(Math.acos(normZ) * 180 / Math.PI);
      }
}