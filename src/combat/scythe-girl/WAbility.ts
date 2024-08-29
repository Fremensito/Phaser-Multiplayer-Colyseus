import { Character } from "../../game-objects/Character";
import { Enemy } from "../../game-objects/Enemy";
import { UIAbility } from "../../interfaces/Ability";
import { Ability } from "../Ability";
import { Globals } from "../../globals/Globals";
import { WorldManager } from "../../managers/WorldManager";
import SAT from "sat";

export class WAbility extends Ability{
    enemiesHit = new Array<Enemy>();
    character: Character
    worldManager: WorldManager

    constructor(
        name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, character:Character, worldManager: WorldManager
    ){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range);
        this.character = character;
        this.worldManager = worldManager
    }

    doDamage(character:Character){
        console.log(this.enemiesHit.length)
        this.worldManager.enemies.forEach(e=>{
            if(!this.enemiesHit.includes(e) 
                && (new SAT.Vector(character.position.x - e.position.x, character.position.y -e.position.y)).len() <= this.range){
                e.getDamage(10);
                this.enemiesHit.push(e);
            }
        })
    }

    clear(){
        this.enemiesHit = [];
    }
}