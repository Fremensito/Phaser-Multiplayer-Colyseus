import { UIAbility } from "../../interfaces/Ability"
import { WorldManager } from "../../managers/WorldManager"
import SAT from "sat";
import { ScytheGirl } from "../../game-objects/characters/scythe-girl/ScytheGirl";
import { SScytheGirl } from "../../schemas/SScytheGirl";
import { MyRoom } from "../../rooms/MyRoom";
import { AliveEntity } from "../../game-objects/AliveEntity";
import { generateDebugger, updateStraightDirectionAbility } from "../../utils/Debugger";
import { StraightDirectionAttack } from "../StraightDirectionAttack";

export class QAbility extends StraightDirectionAttack{
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth = 32 //relative to the directions up or down
    up: SAT.Box;
    right: SAT.Box;
    down: SAT.Box;
    left: SAT.Box;

    worldManager: WorldManager

    constructor(character: ScytheGirl, name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range, worldManager)

        if(MyRoom.debug)
            generateDebugger([this.up, this.down, this.right, this.left], 
                (character.schema as SScytheGirl).q);
    }


    // doDamage(direction:string, partition: string, damage: number, character: AliveEntity){
    //     switch(direction){
    //         case this.directions.up:
    //             this.selectEnemies(partition).forEach(k=>{
    //                 this.worldManager.mapParitions.get(k)?.forEach(e=>{
    //                     if(e instanceof BasicMeleeEnemy && SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
    //                     e.getDamage(damage, character)
    //                 })
    //             })
    //             break;
            
    //         case this.directions.right:
    //             this.selectEnemies(partition).forEach(k=>{
    //                 this.worldManager.mapParitions.get(k)?.forEach(e=>{
    //                     if(e instanceof BasicMeleeEnemy && SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
    //                     e.getDamage(damage, character)
    //                 })
    //             })
    //             break;
            
    //         case this.directions.down:
    //             this.selectEnemies(partition).forEach(k=>{
    //                 this.worldManager.mapParitions.get(k)?.forEach(e=>{
    //                     if(e instanceof BasicMeleeEnemy && SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
    //                     e.getDamage(damage, character)
    //                 })
    //             })
    //             break;
            
    //         case this.directions.left:
    //             this.selectEnemies(partition).forEach(k=>{
    //                 this.worldManager.mapParitions.get(k)?.forEach(e=>{
    //                     if(e instanceof BasicMeleeEnemy && SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
    //                     e.getDamage(damage, character)
    //                 })
    //             })
    //             break;
    //     }
    // }

    update(character: AliveEntity, x:number, y: number){
        
        super.update(character, x, y)

        if(MyRoom.debug){
            updateStraightDirectionAbility([this.up, this.down, this.right, this.left], 
                (character.schema as SScytheGirl).q
            )
        }
    }

}