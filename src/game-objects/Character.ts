import Matter, { Engine } from "matter-js";
import { Ability } from "../combat/Ability";
import { AliveEntity } from "./AliveEntity";
import { WorldManager } from "../managers/WorldManager";
import { Globals } from "../globals/Globals";
import { ICharacter } from "../interfaces/Character";
import { IAbility } from "../interfaces/Ability";
import { MyRoom } from "../rooms/MyRoom";

export class Character extends AliveEntity{
    body:Matter.Body;
    characterClass: string
    worldManager: WorldManager
    entityType = "character"

    /**
     * 
     * @param {string} characterClass 
     */
    constructor(speed:number, x:number, y:number, abilities:Array<Ability>, id:string, characterClass:string, engine:Engine,
        room:MyRoom , worldManager: WorldManager
    ){
        super(speed,x,y,abilities,id, engine)
        this.worldManager = worldManager
        this.characterClass = characterClass;
        this.body = Matter.Bodies.rectangle(x,y,20,20, {isSensor:true})
        this.schema.x = x;
        this.schema.y = y;
        this.schema.id = this.id;
        this.schema.health = 100;
        this.schema.type = this.entityType;
        this.body.collisionFilter = {
            category: Globals.categories.characters
        }
        Matter.Composite.add(engine.world, this.body)
        room.state.characters.set(this.id, this.schema)
        this.worldManager.players.set(this.id, this)
    }

    getData():ICharacter{
        let abilities = new Array<IAbility>();
        this.abilities.forEach((a: Ability)=> abilities.push(a.getData()))
        return{
            characterClass: this.characterClass,
            abilities: abilities,
            speed: this.speed,
            x: this.body.position.x,
            y: this.body.position.y,
            id: this.id
        }
    }

    /**
     * 
     * @param {number} delta 
     */
    update(){
        super.update();
        this.updateDirection();
        if(!this.idle && !this.attacking){
            Matter.Body.setVelocity(this.body, {x: this.direction.x*this.speed, y: this.direction.y*this.speed})
        }else if(this.attacking){
            switch(this.ability){
                // case "W":
                //     if(!this.checkPositionGoal()){
                //         this.x += this.speed*this.direction.x*delta/1000
                //         this.y += this.speed*this.direction.y*delta/1000
                //     }
                //     break;
                case "Q":
                    Matter.Body.setVelocity(this.body, {x:0, y:0})
            }
        }
        else{
            Matter.Body.setVelocity(this.body, {x: 0, y:0})
        }
        if(this.checkPositionGoal()){
            this.idle = true
            Matter.Body.setVelocity(this.body, {x:0, y:0})
        }
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    WAction(vector: Matter.Vector){
        this.changeDirectionInput(vector);
        const velocity = {x: this.direction.x * this.speed*3, y: this.direction.y * this.speed*3}
        Matter.Body.setVelocity(this.body, velocity)
    }

    hitWithQ(direction: string){
        this.abilities[0].attack(direction)
    }
}