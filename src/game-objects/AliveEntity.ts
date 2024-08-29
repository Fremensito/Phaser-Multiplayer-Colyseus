import { Ability } from "../combat/Ability";
import { Vector2 } from "../interfaces/Vector2";
import { SAliveEntity } from "../schemas/SAliveEntity";
import SAT from "sat";

export class AliveEntity{
    schema = new SAliveEntity();
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

    constructor(speed: number, x: number, y:number, abilities: Array<Ability>, id: string){
        this.position = new SAT.Vector(x, y);
        this.dead = false;
        this.idle = true;
        this.speed = speed;
        this.direction = new SAT.Vector(x, y+10)
        this.ability = "";
        this.id = id;
        this.pointToMove = new SAT.Vector(x, y+10);
        this.idle = true
        this.attacking = false
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
    }
}