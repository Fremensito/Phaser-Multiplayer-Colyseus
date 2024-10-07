import { AliveEntity } from "../game-objects/AliveEntity";
import { UIAbility } from "../interfaces/Ability";
import { WorldManager } from "../managers/WorldManager";
import { SStraightDirectionsAbility } from "../schemas/combat/SStraightDirectionAbility";
import { Ability } from "./Ability";
import SAT from "sat";

export class StraightDirectionAttack extends Ability{
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth: number;
    up: SAT.Box;
    right: SAT.Box;
    down: SAT.Box;
    left: SAT.Box;

    worldManager: WorldManager

    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, attackWidth: number, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)

        this.worldManager = worldManager;
        this.attackWidth = attackWidth

        this.up = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.down = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.right = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
        this.left = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)

        // if(MyRoom.debug)
        //     generateDebugger([this.up, this.down, this.right, this.left], 
        //         (character.schema as SScytheGirl).q);
    }

    doDamage(direction:string, damage: number, entity: AliveEntity, entities: AliveEntity[]){
        switch(direction){
            case this.directions.up:
                entities.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage, entity)
                })
                break;
            
            case this.directions.right:
                entities.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage, entity)
                })
                break;
            
            case this.directions.down:
                entities.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage, entity)
                })
                break;
            
            case this.directions.left:
                entities.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
                        e.getDamage(damage, entity)
                })
                break;
        }
    }

    update(character: AliveEntity, x:number, y: number){
        
        this.up.pos = new SAT.Vector(x - this.attackWidth/2, y-this.range);

        this.down.pos = new SAT.Vector(x - this.attackWidth/2, y)
  
        this.right.pos = new SAT.Vector(x, y - this.attackWidth/2)

        this.left.pos = new SAT.Vector(x - this.range, y - this.attackWidth/2)
    }

    updateDebugger([up, down, right, left]: Array<SAT.Box>, schema: SStraightDirectionsAbility){
        
    }
}