import { Ability } from "../../../combat/Ability";
import { AliveEntity } from "../../AliveEntity";
import { WorldManager } from "../../../managers/WorldManager";
import { ICharacter } from "../../../interfaces/Character";
import { IAbility } from "../../../interfaces/Ability";
import { MyRoom } from "../../../rooms/MyRoom";
import { WAbility } from "../../../combat/scythe-girl/WAbility";
import { Vector2 } from "../../../interfaces/Vector2";
import SAT from "sat";
import { SScytheGirl } from "../../../schemas/characters/SScytheGirl";
import { NetManager } from "../../../managers/NetManager";
import { ScytheGirlNetManager } from "./ScytheGirlNetManager";

export class ScytheGirl extends AliveEntity{
    characterClass: string
    worldManager: WorldManager
    entityType = "character";
    room:MyRoom;
    /**
     * 
     * @param {string} characterClass 
     */
    constructor(health: number, speed:number, damage: number, x:number, y:number, 
        abilities:Array<Ability>, id:string, characterClass:string, room:MyRoom , worldManager: WorldManager
    ){
        super(health, speed, damage, x,y,abilities,id);
        this.worldManager = worldManager;
        this.room = room;
        this.characterClass = characterClass;
        this.schema = new SScytheGirl();
        this.schema.x = x;
        this.schema.y = y;
        this.schema.health = this.health

        this.setPartition()

        this.schema.id = this.id;
        this.schema.health = 100;
        this.schema.type = this.entityType;

        room.state.scytheGirls.set(this.id, this.schema as SScytheGirl)
        this.worldManager.scytheGirls.set(this.id, this)

        this.boxHeight = 10;
        this.boxWidth = 10;
        this.box = new SAT.Box(new SAT.Vector(x - this.boxWidth/2, y - this.boxHeight/2), this.boxWidth, this.boxHeight)

        if(MyRoom.debug)
            this.generateDebugger();
    }

    getData():ICharacter{
        let abilities = new Array<IAbility>();
        this.abilities.forEach((a: Ability)=> abilities.push(a.getData()))
        return{
            characterClass: this.characterClass,
            abilities: abilities,
            profile: "/ui/scythe-girl/profile.png",
            speed: this.speed,
            x: this.position.x,
            y: this.position.y,
            id: this.id,
            health: this.health
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
                    (this.abilities[1] as WAbility).doDamage(this, this.partition, this.damage);
                    break;
                case "Q":
                    // Matter.Body.setVelocity(this.body, {x:0, y:0})
            }
        }

        if(this.checkPositionGoal()){
            this.idle = true
        }

        //console.log(this.position)

        if(MyRoom.debug){

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

    getDamage(damage: number, entity: AliveEntity): void {
        console.log(this.id + ": damage " + damage + "; health: " + this.schema.health)
        ScytheGirlNetManager.characterReceiveDamage(this.room, this, damage)
        this.health -= damage;
        this.schema.health -= damage;
    }
}