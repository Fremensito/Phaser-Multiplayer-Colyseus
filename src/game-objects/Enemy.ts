import { Ability } from "../combat/Ability";
import { AliveEntity } from "./AliveEntity";
import { WorldManager } from "../managers/WorldManager";
import { IEnemy } from "../interfaces/Enemy";
import { MyRoom } from "../rooms/MyRoom";
import { getRandomInt } from "../math/Math";
import { Vector2 } from "../interfaces/Vector2";
import SAT from "sat";

export class Enemy extends AliveEntity{

    timeout = false
    worldManager: WorldManager
    room:MyRoom
    entityType: "enemy"
    lastPosition = {x:0, y:0}

    constructor(speed: number, x:number, y:number, abilities: Array<Ability>, id: string, room: MyRoom, 
        worldManager: WorldManager
    ){
        super(speed,x,y,abilities,id)
        this.worldManager = worldManager;
        this.room = room;
        this.health = 50;

        this.worldManager.enemies.set(this.id, this)
        this.schema.id = id;
        this.schema.x = x;
        this.schema.y = y;

        this.setPartition()

        this.schema.health = this.health
        this.schema.type = this.entityType;
        this.room.state.enemies.set(this.id, this.schema)
        setTimeout(this.randomMovement, 5000, this)

        this.boxWidth = 5;
        this.boxHeight = 10;
        this.box = new SAT.Box(new SAT.Vector(x - this.boxWidth/2, y - this.boxHeight/2), this.boxWidth, this.boxHeight)
    }

    setPartition(){
        this.worldManager.mapParitions.get(
                Math.floor(Math.floor(this.position.x/this.worldManager.width)).toString()+
                Math.floor(Math.floor(this.position.y/this.worldManager.width)).toString())
                ?.push(this)
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
        this.box.pos.x = (this.position.x - this.boxWidth/2)
        this.box.pos.y = (this.position.y - this.boxHeight/2)
        //console.log("ghost", this.body.position)
    }

    saveLastPosition(){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
    }

    updatePartition(){
        let enemies = this.worldManager.mapParitions.get(
                Math.floor(this.lastPosition.x/this.worldManager.width).toString()+
                Math.floor(this.lastPosition.y/this.worldManager.width).toString())

        enemies.splice(enemies.indexOf(this), 1)
        
        this.setPartition()
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    changeDirectionInput(vector:Vector2){
        // console.log(vector)
        // console.log(this.id)
        this.room.enemyMoves(this, vector)
        super.changeDirectionInput(vector)
    }

    /**
     * 
     * @param {number} damage 
     */
    getDamage(damage:number){
        console.log(this.id + ": damge " + damage)
        this.health -= damage;
        this.schema.health -= damage;
        console.log(this.schema.health)
        if(this.health <= 0){
            this.dead = true
            setTimeout((enemy:Enemy)=>{
                console.log(this.id, "died")
                enemy.room.state.enemies.delete(this.id)
                enemy.worldManager.enemies.delete(this.id)
                
                let enemies = this.worldManager.mapParitions.get(
                    Math.floor(this.lastPosition.x/this.worldManager.width).toString()+
                    Math.floor(this.lastPosition.y/this.worldManager.width).toString())
    
                enemies.splice(enemies.indexOf(this), 1)
            }, 100, this)
        }
    }

    randomMovement(enemy: Enemy){
        if(getRandomInt(1, 10) > 2){
            enemy.idle = false;
            let x = getRandomInt(280, 400);
            let y = getRandomInt(280, 400);
            enemy.changeDirectionInput({x: x, y:y})
        }
        if(!this.dead)
            setTimeout(enemy.randomMovement, 5000, enemy)
    }
}