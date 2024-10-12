import { Ability } from "../../combat/Ability";
import { IEnemy } from "../../interfaces/Enemy";
import { WorldManager } from "../../managers/WorldManager";
import { MyRoom } from "../../rooms/MyRoom";
import { AliveEntity } from "../AliveEntity";

export class Enemy extends AliveEntity{
    worldManager: WorldManager
    room:MyRoom
    entityType: "enemy"
    
    constructor(health: number, speed: number, damage:number, x:number, y:number, abilities: Array<Ability>, id: string, room: MyRoom, 
        worldManager: WorldManager
    ){
        super(health, speed, damage, x, y, abilities,id)
        this.worldManager = worldManager;
        this.room = room;

        this.worldManager.enemies.set(this.id, this)
    }

    getData():IEnemy{return}
}