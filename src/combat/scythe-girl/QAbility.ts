import { Enemy } from "../../game-objects/Enemy"
import { UIAbility } from "../../interfaces/Ability"
import { Ability } from "../Ability"
import { WorldManager } from "../../managers/WorldManager"
import SAT from "sat";

export class QAbility extends Ability{
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth = 32
    up: SAT.Box;
    right: SAT.Box;
    down: SAT.Box;
    left: SAT.Box;

    worldManager: WorldManager

    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)
        this.worldManager = worldManager;

        this.up = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.down = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.right = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
        this.left = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
    }

    doDamage(direction:string, partition: string){
        switch(direction){
            case this.directions.up:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10)
                    })
                })
                break;
            
            case this.directions.right:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10)
                    })
                })
                break;
            
            case this.directions.down:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10)
                    })
                })
                break;
            
            case this.directions.left:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10)
                    })
                })
                break;
        }
    }

    selectEnemies(partition: string): Array<string>{
        let keys = []
        let coords = partition.split("-")
        let xMax = +coords[0] + 2;
        let yMax = +coords[1] + 2;
        for(let i = +coords[1]-1; i < yMax; i++){
            for(let j = +coords[0]-1; j < xMax; j++){
                keys.push(j.toString() + "-" + i.toString())
                // this.worldManager.mapParitions.get(j.toString() + "-" + i.toString())?.forEach(e=>{
                //     if(e instanceof Enemy && SAT.testPolygonPolygon(direction.toPolygon(), e.box.toPolygon()))
                //         e.getDamage(10)
                // })
            }
        }
        return keys;
    }

    update(x:number, y: number){
        
        this.up.pos = new SAT.Vector(x - this.attackWidth/2, y-this.range)

        this.down.pos = new SAT.Vector(x - this.attackWidth/2, y)
  
        this.right.pos = new SAT.Vector(x, y - this.attackWidth/2)

        this.left.pos = new SAT.Vector(x - this.range, y - this.attackWidth/2)
    }
}