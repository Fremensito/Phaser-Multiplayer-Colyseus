import { AliveEntity } from "../game-objects/AliveEntity";
import { ScytheGirl } from "../game-objects/scythe-girl/ScytheGirl";
import { Enemy } from "../game-objects/Enemy";
import SAT from "sat";

export class WorldManager{

    width = 200;

    enemies = new Map<string, Enemy>();
    scytheGirls = new Map<string, ScytheGirl>();
    mapParitions = new Map<string, Array<AliveEntity>>();

    constructor(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.mapParitions.set(j.toString()+ "-" +i.toString(), new Array<AliveEntity>())
            }
        }
    }

    checkCollisions(delta:number){
        this.mapParitions.forEach(p => {
            p.forEach(a => {
                if(a instanceof Enemy){
                    p.forEach(aa => {
                        if(a.id != aa.id && SAT.testPolygonPolygon(a.box.toPolygon(), aa.box.toPolygon())){
                            a.saveLastPosition()
                            let new_direction = (new SAT.Vector(a.position.x-aa.position.x, a.position.y - aa.position.y)).normalize();
                            a.position.x += new_direction.x*a.speed*delta;
                            a.position.y += new_direction.y*a.speed*delta;
                            a.schema.x = a.position.x;
                            a.schema.y = a.position.y;
                            a.box.pos.x = a.position.x;
                            a.box.pos.y = a.position.y;
                            a.updatePartition()
                        }
                    })
                }
            })
        })

        this.scytheGirls.forEach(c=>{
            this.mapParitions.get(c.partition)?.forEach(a=>{
                if(!(a instanceof ScytheGirl) && SAT.testPolygonPolygon(a.box.toPolygon(), c.box.toPolygon())){
                    c.saveLastPosition()
                    let new_direction = (new SAT.Vector(c.position.x-a.position.x, c.position.y - a.position.y)).normalize();
                    c.position.x += new_direction.x * c.speed * delta
                    c.position.y += new_direction.y * c.speed * delta
                    c.schema.x = c.position.x;
                    c.schema.y = c.position.y;
                    c.box.pos.x = c.position.x;
                    c.box.pos.y = c.position.y;
                    c.updatePartition()
                }
            })
        })
    }
}