import { Ability } from "../combat/Ability";
import { AliveEntity } from "./AliveEntity";
import { WorldManager } from "../managers/WorldManager";
import { Globals } from "../globals/Globals";
import { ICharacter } from "../interfaces/Character";
import { IAbility } from "../interfaces/Ability";
import { MyRoom } from "../rooms/MyRoom";
import { WAbility } from "../combat/scythe-girl/WAbility";
import { Vector2 } from "../interfaces/Vector2";
import SAT from "sat";

export class Character extends AliveEntity{
    characterClass: string
    worldManager: WorldManager
    entityType = "character";
    /**
     * 
     * @param {string} characterClass 
     */
    constructor(speed:number, x:number, y:number, abilities:Array<Ability>, id:string, characterClass:string, room:MyRoom , worldManager: WorldManager
    ){
        super(speed,x,y,abilities,id)
        this.worldManager = worldManager
        this.characterClass = characterClass;
        this.schema.x = x;
        this.schema.y = y;

        this.setPartition()

        this.schema.id = this.id;
        this.schema.health = 100;
        this.schema.type = this.entityType;

        room.state.characters.set(this.id, this.schema)
        this.worldManager.players.set(this.id, this)

        this.boxHeight = 10;
        this.boxWidth = 10;
        this.box = new SAT.Box(new SAT.Vector(x - this.boxWidth/2, y - this.boxHeight/2), this.boxWidth, this.boxHeight)
    }

    getData():ICharacter{
        let abilities = new Array<IAbility>();
        this.abilities.forEach((a: Ability)=> abilities.push(a.getData()))
        return{
            characterClass: this.characterClass,
            abilities: abilities,
            speed: this.speed,
            x: this.position.x,
            y: this.position.y,
            id: this.id
        }
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta: number){
        this.saveLastPosition()
        super.update(delta);
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.position.x += this.speed*this.direction.x*delta
            this.position.y += this.speed*this.direction.y*delta
        }else if(this.attacking){
            switch(this.ability){
                case "W":
                    if(!this.checkPositionGoal()){
                        this.position.x += this.speed*this.direction.x*delta*3
                        this.position.y += this.speed*this.direction.y*delta*3
                    }
                    (this.abilities[1] as WAbility).doDamage(this);
                    break;
                case "Q":
                    // Matter.Body.setVelocity(this.body, {x:0, y:0})
            }
        }

        if(this.checkPositionGoal()){
            this.idle = true
        }

        this.updatePartition();

        this.box.pos.x = (this.position.x - this.boxWidth/2)
        this.box.pos.y = (this.position.y - this.boxHeight/2)
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    WAction(vector: Vector2){
        this.changeDirectionInput(vector);
    }
    
    hitWithQ(direction: string){
        this.abilities[0].attack(direction)
    }
}