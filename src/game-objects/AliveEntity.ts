import { Ability } from "../combat/Ability";
import { Vector2 } from "../interfaces/Vector2";
import { WorldManager } from "../managers/WorldManager";
import { SAliveEntity } from "../schemas/SAliveEntity";
import SAT from "sat";
import { SVector2 } from "../schemas/SVector2";
import { MyRoom } from "../rooms/MyRoom";

export class AliveEntity{
    schema: SAliveEntity;
    speed:  number
    direction: SAT.Vector
    abilities: Array<Ability>
    ability: string;
    id: string
    idle: boolean
    pointToMove: Vector2
    attacking: boolean
    health: number
    dead: boolean
    position: Vector2
    boxHeight: number;
    boxWidth: number;
    box: SAT.Box;
    lastPosition = {x:0, y:0}
    worldManager: WorldManager
    partition:string;
    damage: number;

    constructor(speed: number, damage: number, x: number, y:number, abilities: Array<Ability>, id: string){
        this.position = new SAT.Vector(x, y);
        this.dead = false;
        this.idle = true;
        this.speed = speed;
        this.damage = damage;
        this.direction = new SAT.Vector(x, y+10)
        this.ability = "";
        this.id = id;
        this.pointToMove = new SAT.Vector(x, y+10);
        this.idle = true
        this.attacking = false
    }

    generateDebugger(){
        this.box.toPolygon().calcPoints.forEach(()=> {
            this.schema.box.push(new SVector2());
        })
    }

    saveLastPosition(){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
    }

    setPartition(){
        this.worldManager.mapParitions.get(
                Math.floor(Math.floor(this.position.x/this.worldManager.width)).toString()+ "-" +
                Math.floor(Math.floor(this.position.y/this.worldManager.width)).toString())
                ?.push(this)
        
        this.partition = Math.floor(Math.floor(this.position.x/this.worldManager.width)).toString()+ "-" +
        Math.floor(Math.floor(this.position.y/this.worldManager.width)).toString()
    }

    updatePartition(){
        let enemies = this.worldManager.mapParitions.get(
                Math.floor(this.lastPosition.x/this.worldManager.width).toString()+ "-" +
                Math.floor(this.lastPosition.y/this.worldManager.width).toString())

        enemies?.splice(enemies.indexOf(this), 1)
        
        this.setPartition()
    }

    updateDirection(){
        this.direction = (new SAT.Vector(this.pointToMove.x - this.position.x, this.pointToMove.y - this.position.y)).normalize();
    }

    checkPositionGoal(){
        return(
            (this.position.x >=this.pointToMove.x -2 && this.position.x <= this.pointToMove.x +2) &&
            (this.position.y >=this.pointToMove.y -2 && this.position.y <= this.pointToMove.y +2)
        )
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    changeDirectionInput(vector: Vector2){
        this.pointToMove.x = vector.x;
        this.pointToMove.y = vector.y;
        this.direction = (new SAT.Vector(vector.x - this.position.x, vector.y - this.position.y)).normalize();
    }

    update(delta: number){
        this.schema.x = this.position.x;
        this.schema.y = this.position.y;
        this.schema.idle = this.idle;
        if(MyRoom.debug){
            this.updateDebugger();
        }
    }

    updateDebugger(){
        for(let i = 0; i < this.box.toPolygon().calcPoints.length; i++){
            this.schema.box[i].x = this.box.pos.x + this.box.toPolygon().calcPoints[i].x;
            this.schema.box[i].y = this.box.pos.y + this.box.toPolygon().calcPoints[i].y;
        }
    }
}