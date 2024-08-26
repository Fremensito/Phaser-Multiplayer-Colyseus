import { Engine } from "matter-js";
import { Ability } from "../combat/Ability";
import { AliveEntity } from "./AliveEntity";
import { WorldManager } from "../managers/WorldManager";
import Matter from "matter-js";
import { Globals } from "../globals/Globals";
import { IEnemy } from "../interfaces/Enemy";
import { MyRoom } from "../rooms/MyRoom";
import { getRandomInt } from "../math/Math";

export class Enemy extends AliveEntity{

    timeout = false
    engine: Engine
    worldManager: WorldManager
    room:MyRoom
    entityType: "enemy"

    constructor(speed: number, x:number, y:number, abilities: Array<Ability>, id: string, engine:Engine, room: MyRoom, 
        worldManager: WorldManager
    ){
        super(speed,x,y,abilities,id, engine)
        this.worldManager = worldManager;
        this.room = room;
        this.health = 50;
        this.engine = engine
        this.body = Matter.Bodies.rectangle(x, y, 10, 20, {isSensor: true, label: id,})
        this.body.label = this.id
        this.body.collisionFilter = {
            category: Globals.categories.enemies,
            mask: Globals.categories.abilities,
            group: 0
        }

        Matter.Composite.add(engine.world, this.body)
        this.worldManager.enemies.set(this.id, this)
        this.schema.id = id;
        this.schema.x = x;
        this.schema.y = y;
        this.schema.health = this.health
        this.schema.type = this.entityType;
        this.room.state.enemies.set(this.id, this.schema)
        setTimeout(this.randomMovement, 5000, this)
    }

    getData():IEnemy{
        return{
            speed: this.speed,
            x: this.body.position.x,
            y: this.body.position.y,
            pointToMoveX: this.pointToMove.x,
            pointToMoveY: this.pointToMove.y,
            directionX: this.direction.x,
            directionY: this.direction.y,
            velocityX: this.body.velocity.x,
            velocityY: this.body.velocity.y,
            health: this.health,
            id: this.id
        }
    }

    update(){
        super.update();
        this.updateDirection();
        if(!this.idle && !this.attacking){
            Matter.Body.setVelocity(this.body, {x: this.direction.x*this.speed, y: this.direction.y*this.speed})
        }else{
            Matter.Body.setVelocity(this.body, {x: 0, y:0})
        }
        if(this.checkPositionGoal()){
            this.idle = true
            Matter.Body.setVelocity(this.body, {x:0, y:0})
        }
        //console.log("ghost", this.body.position)
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    changeDirectionInput(vector:Matter.Vector){
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
            console.log(this.id + "died")
            Matter.Composite.remove(this.engine.world, this.body);
            this.worldManager.enemies.delete(this.id)
        }
    }

    randomMovement(enemy: Enemy){
        if(getRandomInt(1, 10) > 2){
            enemy.idle = false;
            let x = getRandomInt(280, 400);
            let y = getRandomInt(280, 400);
            enemy.changeDirectionInput({x: x, y: y})
        }
        setTimeout(enemy.randomMovement, 5000, enemy)
    }
}