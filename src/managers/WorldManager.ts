import { AliveEntity } from "../game-objects/AliveEntity";
import { Character } from "../game-objects/Character";
import { Enemy } from "../game-objects/Enemy";
import SAT from "sat";

export class WorldManager{

    width = 200;

    enemies = new Map<string, Enemy>();
    players = new Map<string, Character>();
    mapParitions = new Map<string, Array<AliveEntity>>();

    constructor(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.mapParitions.set(j.toString()+i.toString(), new Array<AliveEntity>())
            }
        }
    }

    checkCollisions(delta:number){
        this.mapParitions.forEach(p => {
            p.forEach(a => {
                if(a instanceof Enemy){
                    p.forEach(aa => {
                        if(a.id != aa.id && SAT.testPolygonPolygon(a.box.toPolygon(), aa.box.toPolygon())){
                            console.log("collisioning enemies")
                            a.saveLastPosition()
                            let new_direction = (new SAT.Vector(a.position.x-aa.position.x, a.position.y - aa.position.y)).normalize();
                            a.position.x += new_direction.x*a.speed*delta;
                            a.position.y += new_direction.y*a.speed*delta;
                            a.updatePartition()
                        }
                    })
                }
            })
        })
    }
}