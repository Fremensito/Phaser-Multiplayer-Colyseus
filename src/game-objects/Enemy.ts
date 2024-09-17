import { Ability } from "../combat/Ability";
import { AliveEntity } from "./AliveEntity";
import { WorldManager } from "../managers/WorldManager";
import { IEnemy } from "../interfaces/Enemy";
import { MyRoom } from "../rooms/MyRoom";
import { getRandomInt } from "../math/Math";
import { Vector2 } from "../interfaces/Vector2";
import SAT from "sat";
import { NetManager } from "../managers/NetManager";
import { SAliveEntity } from "../schemas/SAliveEntity";

export class Enemy extends AliveEntity{

    timeout = false
    worldManager: WorldManager
    room:MyRoom
    entityType: "enemy"
    testX: number;
    testY: number;
    agro: AliveEntity;

    constructor(speed: number, damage:number, x:number, y:number, abilities: Array<Ability>, id: string, room: MyRoom, 
        worldManager: WorldManager
    ){
        super(speed, damage, x,y,abilities,id)
        this.worldManager = worldManager;
        this.room = room;
        this.health = 50;

        this.worldManager.enemies.set(this.id, this)
        this.schema = new SAliveEntity();
        this.schema.id = id;
        this.schema.x = x;
        this.schema.y = y;
        this.testX = x;
        this.testY = y;

        this.setPartition()

        this.schema.health = this.health
        this.schema.type = this.entityType;

        //Inserting the schema in the enemies collection state
        this.room.state.enemies.set(this.id, this.schema)
        
        setTimeout(this.randomMovement, 5000, this)

        this.boxWidth = 5;
        this.boxHeight = 10;
        this.box = new SAT.Box(new SAT.Vector(x - this.boxWidth/2, y - this.boxHeight/2), this.boxWidth, this.boxHeight)

        if(MyRoom.debug)
            this.generateDebugger();
    }

    getData():IEnemy{
        return{
            speed: this.speed,
            x: this.position.x,
            y: this.position.y,
            pointToMoveX: this.pointToMove.x,
            pointToMoveY: this.pointToMove.y,
            directionX: this.direction.x,
            directionY: this.direction.y,
            health: this.health,
            id: this.id
        }
    }

    update(delta:number){
        this.saveLastPosition()
        super.update(delta);
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.position.x += this.speed*this.direction.x*delta
            this.position.y += this.speed*this.direction.y*delta
        }
        if(this.checkPositionGoal()){
            this.idle = true
        }
        this.updatePartition()
        this.box.pos.x = (this.position.x - this.boxWidth/2)
        this.box.pos.y = (this.position.y - this.boxHeight/2)
        //console.log("ghost", this.body.position)
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    changeDirectionInput(vector:Vector2){
        // console.log(vector)
        // console.log(this.id)
        NetManager.enemyMoves(this.room, this, vector)
        super.changeDirectionInput(vector)
    }

    /**
     * 
     * @param {number} damage 
     */
    getDamage(damage:number){
        console.log(this.id + ": damage " + damage)
        NetManager.enemyReceiveDamage(this.room, this, damage)
        this.health -= damage;
        this.schema.health -= damage;
        console.log(this.schema.health)
        if(this.health <= 0){
            this.dead = true
            setTimeout((enemy:Enemy)=>{
                console.log(this.id, "died")
                enemy.room.state.enemies.delete(this.id)
                enemy.worldManager.enemies.delete(this.id)
                
                let enemies = this.worldManager.mapParitions.get(this.partition)
    
                enemies.splice(enemies.indexOf(this), 1)
            }, 100, this)
        }
    }

    randomMovement(enemy: Enemy){
        if(getRandomInt(1, 10) > 2){
            enemy.idle = false;
            let x = getRandomInt(enemy.testX-80, enemy.testX+80);
            let y = getRandomInt(enemy.testY-80, enemy.testY+80);
            enemy.changeDirectionInput({x: x, y:y})
        }
        if(!this.dead)
            setTimeout(enemy.randomMovement, 5000, enemy)
    }
}