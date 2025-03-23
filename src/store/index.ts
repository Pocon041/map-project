import L from 'leaflet'
import {makeAutoObservable} from 'mobx'

class App{
    private name = "遥感可视化";
    map!: L.Map;
    constructor(){
        makeAutoObservable(this);
    }
    setName = (name:string) =>{
        this.name = name;
    };

    setMap = (map: L.Map) => {
        this.map = map;
    } 
}

export default new App();