import { Viewer } from "cesium";
import { makeAutoObservable } from "mobx";

class App {
    name = "遥感可视化";
    map!: Viewer;

    constructor() {
        makeAutoObservable(this);
    }

    setName = (name: string) => {
        this.name = name;
    }

    setMap = (map: Viewer) => {
        this.map = map;
    }
}

const store = new App();
export default store;