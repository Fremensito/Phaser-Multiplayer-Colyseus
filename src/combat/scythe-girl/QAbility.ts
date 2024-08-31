import { Character } from "../../game-objects/Character"
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

    character:Character
    worldManager: WorldManager

    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, character:Character, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)
        this.worldManager = worldManager;
        this.character = character

        this.up = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.down = new SAT.Box(new SAT.Vector(0, 0), this.attackWidth, this.range)
        this.right = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
        this.left = new SAT.Box(new SAT.Vector(0, 0), this.range, this.attackWidth)
    }

    doDamage(direction:string){
        switch(direction){
            case this.directions.up:
                this.worldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10);
                })
                break;
            
            case this.directions.right:
                this.worldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10);
                })
                break;
            
            case this.directions.down:
                this.worldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10);
                })
                break;
            
            case this.directions.left:
                this.worldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
                        e.getDamage(10);
                })
                break;
        }
    }

    update(){
        
        this.up.pos = new SAT.Vector(this.character.position.x - this.attackWidth/2, this.character.position.y-this.range)

        this.down.pos = new SAT.Vector(this.character.position.x - this.attackWidth/2, this.character.position.y)
  
        this.right.pos = new SAT.Vector(this.character.position.x, this.character.position.y - this.attackWidth/2)

        this.left.pos = new SAT.Vector(this.character.position.x - this.range, this.character.position.y - this.attackWidth/2)
    }
}