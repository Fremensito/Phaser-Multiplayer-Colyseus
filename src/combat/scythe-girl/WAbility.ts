import { BasicMeleeEnemy } from "../../game-objects/enemies/BasicMeleeEnemy";
import { UIAbility } from "../../interfaces/Ability";
import { Ability } from "../Ability";
import { WorldManager } from "../../managers/WorldManager";
import SAT from "sat";
import { ScytheGirl } from "../../game-objects/characters/scythe-girl/ScytheGirl";

export class WAbility extends Ability{
    enemiesHit = new Array<BasicMeleeEnemy>();
    worldManager: WorldManager

    constructor(
        name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, worldManager: WorldManager
    ){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range);
        this.worldManager = worldManager
    }

    doDamage(character:ScytheGirl, partition: string, damage:number){
        this.selectEnemies(partition).forEach(k=>{
            this.worldManager.mapParitions.get(k)?.forEach(e => {
                if(e instanceof BasicMeleeEnemy && !this.enemiesHit.includes(e)
                    && (new SAT.Vector(character.position.x - e.position.x, character.position.y -e.position.y)).len() <= this.range){
                        e.getDamage(damage*1.25, character)
                        this.enemiesHit.push(e)
                    }
            })
        })
        // this.worldManager.enemies.forEach(e=>{
        //     if(!this.enemiesHit.includes(e) 
        //         && (new SAT.Vector(character.position.x - e.position.x, character.position.y -e.position.y)).len() <= this.range){
        //         e.getDamage(10);
        //         this.enemiesHit.push(e);
        //     }
        // })
    }

    clear(){
        this.enemiesHit = [];
    }
}