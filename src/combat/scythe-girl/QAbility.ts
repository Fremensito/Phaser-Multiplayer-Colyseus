import { Enemy } from "../../game-objects/Enemy"
import { UIAbility } from "../../interfaces/Ability"
import { Ability } from "../Ability"
import { WorldManager } from "../../managers/WorldManager"
import SAT from "sat";
import { ScytheGirl } from "../../game-objects/scythe-girl/ScytheGirl";
import { SScytheGirl } from "../../schemas/SScytheGirl";
import { SVector2 } from "../../schemas/SVector2";
import { MyRoom } from "../../rooms/MyRoom";
import { AliveEntity } from "../../game-objects/AliveEntity";

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

    constructor(character: ScytheGirl, name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)
        this.worldManager = worldManager;

        this.up = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.down = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.right = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
        this.left = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)

        if(MyRoom.debug)
            this.generateDebugger(character);
    }

    generateDebugger(character: ScytheGirl){
        this.up.toPolygon().calcPoints.forEach(()=>{
            let sschema = new SVector2();
            (character.schema as SScytheGirl).qUp.push(sschema);
        })

        this.down.toPolygon().calcPoints.forEach(()=>{
            let sschema = new SVector2();
            (character.schema as SScytheGirl).qDown.push(sschema);
        })

        this.right.toPolygon().calcPoints.forEach(()=>{
            let sschema = new SVector2();
            (character.schema as SScytheGirl).qRight.push(sschema);
        })

        this.left.toPolygon().calcPoints.forEach(()=>{
            let sschema = new SVector2();
            (character.schema as SScytheGirl).qLeft.push(sschema);
        })
    }

    doDamage(direction:string, partition: string, damage: number){
        switch(direction){
            case this.directions.up:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage)
                    })
                })
                break;
            
            case this.directions.right:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage)
                    })
                })
                break;
            
            case this.directions.down:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage)
                    })
                })
                break;
            
            case this.directions.left:
                this.selectEnemies(partition).forEach(k=>{
                    this.worldManager.mapParitions.get(k)?.forEach(e=>{
                        if(e instanceof Enemy && SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage)
                    })
                })
                break;
        }
    }

    update(character: AliveEntity, x:number, y: number){
        
        this.up.pos = new SAT.Vector(x - this.attackWidth/2, y-this.range);

        this.down.pos = new SAT.Vector(x - this.attackWidth/2, y)
  
        this.right.pos = new SAT.Vector(x, y - this.attackWidth/2)

        this.left.pos = new SAT.Vector(x - this.range, y - this.attackWidth/2)

        if(MyRoom.debug){
            this.updateDebugger(character)
        }
    }

    updateDebugger(character: AliveEntity){
        for(let i = 0; i < this.up.toPolygon().calcPoints.length; i++){
            (character.schema as SScytheGirl).qUp[i].x = this.up.pos.x + this.up.toPolygon().calcPoints[i].x;
            (character.schema as SScytheGirl).qUp[i].y = this.up.pos.y + this.up.toPolygon().calcPoints[i].y;
        }

        for(let i = 0; i < this.down.toPolygon().calcPoints.length; i++){
            (character.schema as SScytheGirl).qDown[i].x = this.down.pos.x + this.down.toPolygon().calcPoints[i].x;
            (character.schema as SScytheGirl).qDown[i].y = this.down.pos.y + this.down.toPolygon().calcPoints[i].y;
        }

        for(let i = 0; i < this.right.toPolygon().calcPoints.length; i++){
            (character.schema as SScytheGirl).qRight[i].x = this.right.pos.x + this.right.toPolygon().calcPoints[i].x;
            (character.schema as SScytheGirl).qRight[i].y = this.right.pos.y + this.right.toPolygon().calcPoints[i].y;
        }

        for(let i = 0; i < this.left.toPolygon().calcPoints.length; i++){
            (character.schema as SScytheGirl).qLeft[i].x = this.left.pos.x + this.left.toPolygon().calcPoints[i].x;
            (character.schema as SScytheGirl).qLeft[i].y = this.left.pos.y + this.left.toPolygon().calcPoints[i].y;
        }
    }
}