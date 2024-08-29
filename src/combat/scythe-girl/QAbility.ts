import { Character } from "../../game-objects/Character"
import { Enemy } from "../../game-objects/Enemy"
import { UIAbility } from "../../interfaces/Ability"
import { Ability } from "../Ability"
import { Globals } from "../../globals/Globals"
import { WorldManager } from "../../managers/WorldManager"
import SAT from "sat";

export class QAbility extends Ability{
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    character:Character
    worldManager: WorldManager

    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, character:Character, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)
        this.worldManager = worldManager;
        this.character = character
    }

    doDamage(direction:string, character:Character){
        switch(direction){
            case this.directions.up:
               this.worldManager.enemies.forEach(e=>{
                    if(e.position.y <= character.position.y 
                        && (new SAT.Vector(e.position.x - character.position.x, e.position.y - character.position.y)).len() <= this.range)
                        e.getDamage(10);
                })
                break;
            
            case this.directions.right:
               this.worldManager.enemies.forEach(e=>{
                    if(e.position.x >= character.position.x 
                        && (new SAT.Vector(e.position.x - character.position.x, e.position.y - character.position.y)).len() <= this.range)
                        e.getDamage(10);
                })
                break;
            
            case this.directions.down:
               this.worldManager.enemies.forEach(e=>{
                    if(e.position.y >= character.position.y 
                        && (new SAT.Vector(e.position.x - character.position.x, e.position.y - character.position.y)).len() <= this.range)
                        e.getDamage(10);
                })
                break;
            
            case this.directions.left:
               this.worldManager.enemies.forEach(e=>{
                    if(e.position.x <= character.position.x 
                        && (new SAT.Vector(e.position.x - character.position.x, e.position.y - character.position.y)).len() <= this.range)
                        e.getDamage(10);
                })
                break;
        }
    }
}